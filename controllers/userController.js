const DAOUser = require("../model/DAOUser");
const fs = require('fs');
const DAOUserr = new DAOUser();



module.exports = {
    login(request, response) {
        response.render("login", { error: null });
    },
    isUser(request, response, next) {
        DAOUserr.isUser(request.body.user, request.body.password, function(err, result) {
            if (err) {
                console.log(err);
                response.render("login", { error: "Error interno de acceso a la base de datos" });
            } else if (!result) {
                response.render("login", { error: "No existe el usuario" });
            } else {
                console.log(result);
                request.session.email = result[0].correo;
                request.session.password = request.body.password;
                console.log("sasasasa");
                response.redirect("/");
            }
        });
    },
    doRegister(request, response){
        response.render("registration", { error: null });
    },
    register(request, response){
        /*var img = request.body.img;
        if(img === ""){
            console.log("sasasa");
            fs.readdir("\images", function(err, files){
                if(err) console.log(err);
                else {
                    var random = files[Math.floor(Math.random()*files.length)];

                }   
            })
        }
        DAOUserr.register(request.body.user, request.body.password, function(err, result) {
            if (err) {
                console.log(err);
                response.render("login", { error: "Error interno de acceso a la base de datos" });
            } else if (!result) {
                response.render("login", { error: "No existe el usuario" });
            } else {
                console.log(result);
                request.session.email = result[0].correo;
                request.session.password = request.body.password;
                console.log("sasasasa");
                response.redirect("/");
            }
        });*/
    }
};