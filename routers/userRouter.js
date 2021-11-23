const express = require("express");
const path = require("path");
const nconf = require("nconf");
const multer = require("multer");
const fs = require("fs");
const usersController = require("../controllers/userController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destination = path.resolve(nconf.get("web:user:image:path"));
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
      }
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, "user_" + Date.now() + ".jpg");
    },
  });
  
  function fileFilter(req, file, cb) {
    var ext = path.extname(file.originalname);
    if (
      file.mimetype !== "image/jpeg" ||
      (ext.toLowerCase() != ".jpg" && ext.toLowerCase() != ".jpeg")
    ) {
      return cb(
        null,
        false,
        new Error("ERROR: La extensión de la imagen es distinta de JPG")
      );
    }
    cb(null, true);
  }
  
  const multerFactory = multer({
    storage,
    fileFilter,
    limits: { fileSize: nconf.get("web:user:image:size") },
  });

  function checkSession(request, response, next) { 
    if (request.session.email) {
      response.locals.email = request.session.email;
      response.locals.name = request.session.name;
      response.locals.userId = request.session.userId;
      response.locals.image = request.session.image;

      response.redirect("/collections/");
    } else {
      next();
    }
}

router.get("/login", checkSession, usersController.login);
router.post("/login", checkSession, usersController.checkUser);
router.get("/logout", usersController.logged, usersController.logout);

router.get("/register", checkSession, usersController.getRegisterUser);

router.post(
    "/register",
    multerFactory.single("filename"),
    usersController.registerUser
  );

module.exports=router;