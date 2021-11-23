var express = require('express');
var router = express.Router();
const usersController = require("../controllers/userController");

router.get("/login", usersController.login);
router.post("/login", usersController.isUser)

module.exports = router;
