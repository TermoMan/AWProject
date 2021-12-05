var express = require('express');
var router = express.Router();
var path = require('path');
const DAOQuest = require("../model/DAOQuest");
const fs = require('fs');
const DAOQuestt = new DAOQuest();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(res.locals);
    res.render('index');
});

router.get('/showQuestions', function(request, response){
    DAOQuestt.getQuestions(function(err, result) {
        let quests = new Array();
        if (err) {
            console.log(err);
            response.render("allQuest", {quests, error: "Error interno de acceso a la base de datos"});
        } else if (!result) {
            response.render("allQuest", {quests, error: null});
        } else {
            result.forEach(e => {
                let q = {
                    titulo: e.titulo,
                    cuerpo: e.cuerpo,
                    fecha: e.fecha,
                    nickname: e.nickname,
                    imagen: e.imagen
                };
                quests.push(q);
            });
            response.render("allQuest", {quests, error: null});
        }
    });
});

module.exports = router;