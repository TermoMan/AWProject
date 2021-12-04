var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })
const usersController = require("../controllers/userController");

router.get("/login", usersController.login);
router.post("/login", usersController.isUser);

router.get("/doRegister", usersController.doRegister);
router.post("/register", upload.single("img"), usersController.register);

module.exports = router;
