const usersModel = require("../models/userModel");
const mysql = require("mysql");
const nconf = require("nconf");
const path = require("path");
const fs = require("fs-extra");

const userModel = new usersModel();

/**
 *
 * @param {string} str
 */
 const fullTrim = (str) =>
 str
   .trim()
   .split(" ")
   .filter((v) => !!v)
   .join(" ");
 
 /**
  *
  * @param {string} name
  * @param {{ name: string; size: number; mimetype: string; }} image
  * @returns {string?} null if validation passes, otherwise it returns the error message.
  */
function validateUser(name, email, password1, password2, image) {
 const _name = fullTrim(name);
 if (_name.length == 0) return "Nombre requerido";
 if (email.length == 0) return "Email requerido";
 if (image) {
   if (image.size > 1024 * 1024) return "Imagen con tamaño superior a 1 MB";
   if (image.mimetype !== "image/jpeg")
     return "La imagen debe ser formato JPG/JPEG";
 }
 if (password1!==password2) return "Las constraseñas deben coincidir";
 return null;
}

module.exports = {
  validateUser,
  login(request, response) {
    response.render("login", { error: null, name: undefined });
  },

  logout(request, response){
    response.status(200);
    request.session.destroy();
    response.redirect("/users/login");
  },

  checkUser(request, response, next) {
    //Se comprueba si los datos de entrada del formulario de inicio de sesión están bien
    userModel.checkUser(
      request.body.user,
      request.body.password,
      function (err, result) {
        if (err) {
          response.status(500);
          response.render("login", {
            error: "Error interno de acceso a la base de datos",
          });
        } else if (!result) {
          response.status(200);
          response.render("login", {
            error: "Email/nombre y/o contraseña no válidos",
          });
        } else {
          request.session.email =result[0].email;
          request.session.name = result[0].username;
          request.session.password = request.body.password;
          request.session.userId = result[0].id;
          request.session.image = result[0].image;
        
          response.redirect("/collections"); 
        }
      }
    );
  },

  logged(request, response, next) { 
    if (request.session.email) {
      response.locals.email = request.session.email;
      response.locals.name = request.session.name;
      response.locals.password =  request.session.password;
      response.locals.userId = request.session.userId;
      response.locals.image = request.session.image;
      next();

    } else {
      response.redirect("/users/login");
    }
},
  getRegisterUser(request, response, next){
    response.render("registerAccount", { error: null });
  },
  registerUser(request, response, next){
    let username = request.body.name;
    let email = request.body.email;
    let password1 = request.body.password1;
    let password2 = request.body.password2;
    let image;

    // Si el usuario ha subido una imagen
    const file = request.file;
    if (file) {
      image = {
        name: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
    }
    let error = validateUser(username, email, password1, password2, image);
    if (error) {
      if (image) {
        fs.unlink(
          path.resolve(nconf.get("web:collection:image:path"), image.name),
          (err) => console.error(err)
        );
      }
      response.render("registerAccount", { error });
      return;
    }
    const filename = image ? image.name : null;
    userModel.insertUser(username,password1,email,filename,function(err,result){
      if(err){
        next(err);
      }
      else if (!result){
        response.render("registerAccount", {
          error: "ERROR: Nombre de usuario o correo ya en uso",
        });
      }
      else{
        response.redirect("/users/login");
      }
    });
  }
};

