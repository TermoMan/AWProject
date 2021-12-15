var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
const usersController = require("../controllers/usersController");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

function isLogged(request, response, next){
    if(response.locals.email) next();
    else response.redirect("/");
}
function isNotLogged(request, response, next){
    if(!response.locals.email) next();
    else response.redirect("/");
}

router.get('/',isLogged, function(request, response, next) {
    response.redirect("/");
});

router.get("/login", isNotLogged,usersController.login);
router.post("/login", usersController.isUser);

router.get("/logout", isLogged,usersController.logout);

router.get("/doRegister",isNotLogged, usersController.doResgister);
router.post("/register", upload.single("img"), usersController.register);

module.exports = router;