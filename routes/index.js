var express = require('express');
var router = express.Router();
var path = require('path');
const DAOQuest = require("../model/DAOQuest");
const fs = require('fs');
const DAOQuestt = new DAOQuest();

/* GET home page. */
router.get('/', function(request, response, next) {
    console.log(response.locals);
    response.render('index');
});

router.get('/showQuestions', function(request, response){
    console.log(response.locals);
    DAOQuestt.getQuestions(function(err, result) {
        let quests = new Array();
        if (err) {
            console.log(err);
            response.render("allQuest", {quests, error: "Error interno de acceso a la base de datos"});
        } else if (!result) {
            response.render("allQuest", {quests, error: null});
        } else {
            result.forEach(e => {
                if (quests.length === 0) quests.push({
                    id: e.idpregunta,
                    titulo: e.titulo,
                    cuerpo: e.cuerpo,
                    fecha: e.fecha,
                    nickname: e.nickname,
                    imagen: e.imagen,
                    tags: [e.texto]
                });
                else{
                    if (quests[quests.length - 1].id === e.idpregunta) quests[quests.length - 1].tags.push(e.texto);
                    else quests.push({
                        id: e.idpregunta,
                        titulo: e.titulo,
                        cuerpo: e.cuerpo,
                        fecha: e.fecha,
                        nickname: e.nickname,
                        imagen: e.imagen,
                        tags: [e.texto]
                    });
                }
            });
            response.render("allQuest", {quests, error: null});
        }
    });
});

router.get('/formQuest', function(request, response){
    console.log(response.locals);
    response.render("newQuest", { error: null });
});

router.post('/insertQuest', function(request, response){
    var lbls = request.body.labels;
    console.log(response.locals);
    lbls = lbls.split("@");
    lbls.shift();
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    DAOQuestt.insertQuest(response.locals.userId, request.body.title, request.body.info, date, lbls, function(err, result) {
        if (err) {
            console.log(err);
            response.render("newQuest", { error: "Error interno de acceso a la base de datos" });
        } else if (!result) {
            response.render("newQuest", { error: "Ya existe esa pregunta" });
        } else {
            response.redirect("/");
        }
    });
});
module.exports = router;