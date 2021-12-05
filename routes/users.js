var express = require('express');
var router = express.Router();
var path = require('path');
const DAOUser = require("../model/DAOUser");
const fs = require('fs');
const DAOUserr = new DAOUser();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })
const usersController = require("../controllers/userController");

router.get("/login", function(request, response) {
    response.render("login", { error: null });
});

router.get("/logout", function(request, response) {
    request.session.destroy();
    response.render('login', { error: null });
});

router.post("/login", function(request, response, next) {
    DAOUserr.isUser(request.body.user, request.body.password, function(err, result) {
        if (err) {
            console.log(err);
            response.render("login", { error: "Error interno de acceso a la base de datos" });
        } else if (!result) {
            response.render("login", { error: "No existe el usuario" });
        } else {
            request.session.email = result[0].correo;
            request.session.password = request.body.password;
            request.session.name = result[0].nickname;
            request.session.userId = result[0].idusuario;
            request.session.image = result[0].imagen;
            request.session.date = result[0].fecha;
            request.session.reputation = result[0].reputacion;

            response.redirect("/");
        }
    });
});

router.get("/doRegister", function(request, response) {
    response.render("register", { error: null });
});
router.post("/register", upload.single("img"), function(request, response) {
    var img = request.file;
    let imagen = null;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    if (img === undefined) {
        var dir = './images/';
        var dir2 = './public/uploads/';
        var files = fs.readdirSync(dir);
        imagen = files[Math.floor(Math.random() * files.length)];
        fs.copyFile(dir += imagen, dir2 += imagen, (err) => {
            if (err) throw err;
        });
    } else imagen = img.originalname;
    DAOUserr.register(request.body.user, request.body.password, request.body.nickname, imagen, date, function(err, result) {
        if (err) {
            console.log(err);
            response.render("register", { error: "Error interno de acceso a la base de datos" });
        } else if (!result) {
            response.render("register", { error: "Ya existe el usuario" });
        } else {
            response.redirect("/users/login");
        }
    });
});

module.exports = router;