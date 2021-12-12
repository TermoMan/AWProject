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

router.get("/login", usersController.login);
router.post("/login", usersController.isUser);

router.get("/logout", usersController.logout);

router.get("/doRegister", usersController.doResgister);
router.post("/register", upload.single("img"), usersController.register);

module.exports = router;