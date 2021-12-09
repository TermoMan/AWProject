var express = require('express');
var router = express.Router();
var path = require('path');
const DAOQuest = require("../model/DAOQuest");
const fs = require('fs');
const DAOQuestt = new DAOQuest();

function convertirFecha(fechaString) {
    var fechaSp = fechaString.split("-");
    var anio = new Date().getFullYear();
    anio = fechaSp[2];
    var mes = fechaSp[1] - 1;
    var dia = fechaSp[0];

    return new Date(anio, mes, dia);
}

function giveFormatQuest(result){
    let quests = new Array();
    result.forEach(e => {
        if(e. cuerpo.length > 150) e.cuerpo = e.cuerpo.substring(0, 150) + "...";
        d = new Date(e.fecha);
        var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        if (quests.length === 0) quests.push({
            id: e.idpregunta,
            titulo: e.titulo,
            cuerpo: e.cuerpo,
            fecha: datestring,
            nickname: e.nickname,
            imagen: e.imagen,
            tags: [e.texto]
        });
        else {
            if (quests[quests.length - 1].id === e.idpregunta) quests[quests.length - 1].tags.push(e.texto);
            else quests.push({
                id: e.idpregunta,
                titulo: e.titulo,
                cuerpo: e.cuerpo,
                fecha: datestring,
                nickname: e.nickname,
                imagen: e.imagen,
                tags: [e.texto]
            });
        }
    });
    quests.sort(function(a, b) {
        return convertirFecha(b.fecha) - convertirFecha(a.fecha);
    });
    return quests;
}

function giveFormatAnsw(result){
    let quests = new Array();
    result.forEach(e => {
        d = new Date(e.fecha);
        var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        if (quests.length === 0) quests.push({
            id: e.idpregunta,
            titulo: e.titulo,
            cuerpo: e.cuerpo,
            fecha: datestring,
            nickname: e.nickname,
            imagen: e.imagen,
            tags: [e.texto],
            respuesta: [{respuesta: e.respuesta, puntuacion: e.puntuacion}]
        });else{
            if(!quests[quests.length - 1].tags.includes(e.texto)) quests[quests.length - 1].tags.push(e.texto);
            if(!quests[quests.length - 1].respuesta.includes({respuesta: e.texto, puntuacion: e.puntuacion})) quests[quests.length - 1].respuesta.push({respuesta: e.texto, puntuacion: e.puntuacion});
        }
    });
    return quests;
}


function findByTag(quests, tag){
    let tagQuests = quests.filter(q => 
        q.tags.includes(tag));
    return tagQuests;
}

/* GET home page. */
router.get('/', function(request, response, next) {
    console.log(response.locals);
    response.render('index');
});

router.get('/showQuestions', function(request, response) {
    var titulo = "Todas Las Preguntas";
    DAOQuestt.getQuestions(function(err, result) {
        let quests = new Array();
        if (err) {
            console.log(err);
            response.render("allQuest", { quests, titulo, error: "Error interno de acceso a la base de datos" });
        } else if (!result) {
            response.render("allQuest", { quests, titulo, error: null });
        } else {
            quests = giveFormatQuest(result);
            response.render("allQuest", { quests, titulo, error: null });
        }
    });

});

router.get('/formQuest', function(request, response) {
    response.render("newQuest", { titulo:null, error: null });
});

router.post('/insertQuest', function(request, response) {
    var lbls = request.body.labels;
    lbls = lbls.split ('@').filter(function(el) {return el.length != 0});
    if(lbls.length> 5) response.render("newQuest", { error: "Tienes un máximo de 5 tags." })
    else{
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        DAOQuestt.insertQuest(response.locals.userId, request.body.title, request.body.info, date, lbls, function(err, result) {
            if (err) {
                console.log(err);
                response.render("newQuest", {error: "Error interno de acceso a la base de datos" });
            } else if (!result) {
                response.render("newQuest", {error: "Ya existe esa pregunta" });
            } else {
                response.redirect("/");
            }
        });
    } 
});

router.post('/search', function(request, response) {
    let text = request.body.texto;
    var titulo = "Resultados de la busqueda "+ "\"" + text + "\"";
    DAOQuestt.getQuestionsText(text, function(err, result) {
        let quests = new Array();
        if (err) {
            console.log(err);
            response.render("index");
        } else if (!result) {
            response.render("index");
        } else {
            quests = giveFormatQuest(result);
            response.render("allQuest", { quests, titulo, error: null });
        }
    })

});

router.get('/notAnswer', function(request, response) {
    var titulo = "Preguntas Sin Responder";
    DAOQuestt.getQuestionsNotAnswer(function(err, result) {
        let quests = new Array();
        if (err) {
            console.log(err);
            response.render("index");
        } else if (!result) {
            response.render("index");
        } else {
            quests = giveFormatQuest(result);
            response.render("allQuest", { quests, titulo, error: null });
        }
    })

});

router.get('/searchByTag/:tag', function(request, response) {
    let tag = request.params.tag;
    var titulo = "Preguntas con la etiqueta [" + tag + "]";
    DAOQuestt.getQuestions(function(err, result) {
        let quests = new Array();
        if (err) {
            console.log(err);
            response.render("allQuest", { quests, titulo, error: "Error interno de acceso a la base de datos" });
        } else if (!result) {
            response.render("allQuest", { quests, titulo, error: null });
        } else {
            quests = giveFormatQuest(result);
            quests = findByTag(quests, tag);
            response.render("allQuest", { quests, titulo, error: null });
        }
    });

});

router.get('/viewInfo/:tit', function(request, response) {
    let tit = request.params.tit;
    DAOQuestt.getAnswers(tit, function(err, result) {
        let answ = new Array();
        if (err) {
            console.log(err);
            response.render("allQuest", { answ,  error: "Error interno de acceso a la base de datos" });
        } else if (!result) {
            response.render("infoQuest", { answ,  error: null });
        } else {
            console.log(result);
            answ = giveFormatAnsw(result);
            console.log("========================================================================");
            console.log(answ);
            response.render("infoQuest", { answ,  error: null });
        }
    });
});

module.exports = router;