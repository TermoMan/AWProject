var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
const questController = require("../controllers/questController");

function isLogged(request, response, next){
    if(response.locals.email) next();
    else response.redirect("/");
}

router.get('/',isLogged, function(request, response, next) {
    response.render('index');
});
router.get('/showQuestions', isLogged, questController.showQuestions);
router.post('/search', isLogged, questController.search);
router.get('/notAnswer', isLogged, questController.showNotAnswer);
router.get('/searchByTag/:tag', isLogged, questController.showByTag);

router.get('/formQuest', isLogged, questController.formQuestion);
router.post('/insertQuest', isLogged, questController.insertQuestion);
router.post('/answer/:id', isLogged, questController.insertAnswer);

router.get('/viewInfo/:id', isLogged, questController.viewQuest);
router.get('/users', isLogged, questController.viewUsers);
router.post('/searchUsers', isLogged, questController.searchUsers);

router.post("/upVote", isLogged, questController.upVote);
router.post("/downVote", isLogged, questController.downVote);

module.exports = router;