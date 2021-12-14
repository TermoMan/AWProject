var path = require('path');
const DAOQuest = require("../model/DAOQuest");
const fs = require('fs');
const DAOQuestt = new DAOQuest();
const medals = require('../medals.js');
const DAOMedalss = require("../model/DAOMedals");
const DAOMedals = new DAOMedalss;
const DAOUser = require('../model/DAOUser');
const DAOUserr = new DAOUser();
const DAOVotess = require("../model/DAOVotes.js");
const DAOVotes = new DAOVotess();

function convertirFecha(fechaString) {
    var fechaSp = fechaString.split("-");
    var anio = new Date().getFullYear();
    anio = fechaSp[2];
    var mes = fechaSp[1] - 1;
    var dia = fechaSp[0];

    return new Date(anio, mes, dia);
}

function giveFormatQuest(result, fc){
    let quests = new Array();
    var arr = new Array();
    result.forEach(e => {
        if(fc && e. cuerpo.length > 150) e.cuerpo = e.cuerpo.substring(0, 150) + "...";
        d = new Date(e.fecha);
        var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        if(e.tags !== null) arr = e.tags.split(',');
        quests.push({
            id: e.idpregunta,
            titulo: e.titulo,
            cuerpo: e.cuerpo,
            fecha: datestring,
            puntos: e.puntos,
            visitas: e.visitas,
            nickname: e.nickname,
            imagen: e.imagen,
            tags: arr
        });
    });
    quests.sort(function(a, b) {
        return convertirFecha(b.fecha) - convertirFecha(a.fecha);
    });
    return quests;
}

function giveFormatUser(result){
    let users = new Array();
    result.forEach(e => {
        if (users.length === 0){
            if(e.texto === null) users.push({id: e.idusuario, name: e.nickname, image: e.imagen, rep: e.reputacion, tags: []});
            else users.push({id: e.idusuario, name: e.nickname, image: e.imagen, rep: e.reputacion, tags: [e.texto]});
        } else {
            if (users[users.length - 1].id === e.idusuario){
                if(e.texto !== null) users[users.length - 1].tags.push(e.texto);
            } 
            else{
                if(e.texto === null) users.push({id: e.idusuario, name: e.nickname, image: e.imagen, rep: e.reputacion, tags: []});
                else users.push({id: e.idusuario, name: e.nickname, image: e.imagen, rep: e.reputacion, tags: [e.texto]});
            } 
        }
    });
    return users;
}

function getCommonTag(result){
    var max = 0;
    var tagP = null;
    let tgs = new Array();
    let elems = new Array();
    let elems2 = new Array();
    let count = new Array();
    result.forEach(e=>{
        if(e.texto!==null){
            tgs = e.texto.split();
            tgs.forEach(el=>{
                elems.push(el);
            });
        }
    });
    elems.sort((a,b)=>{
        if (a == b) return 0;
        else if (a < b) return -1;
        else return 1;
    });
    let tag = elems.shift();
    if(tag!==undefined){
        elems2.push(tag);
        count.push(1);
        elems.forEach(ele=>{
            tag=elems2[elems2.length -1];
            if(ele===tag) {
                let n = count.pop() + 1;
                count.push(n);
            }else {
                elems2.push(ele);
                count.push(1);
            }
        });
    }
    if(count.length) max = Math.max.apply(null, count);
    let i = count.indexOf(max);
    if(i !== -1) tagP = elems2[i];
    return tagP;
}

function findByTag(quests, tag){
    let tagQuests = quests.filter(q => 
        q.tags.includes(tag));
    return tagQuests;
}

function updateMedalQuestions(visitasAnt, visitasNew, tipo, preg, callback){
    let accion = medals.actionmedal(visitasAnt, visitasNew, tipo);
    if(accion.action === "insert"){
        DAOMedals.insertMedalQuestion(preg, accion.idMedal, function(err){
            if(err) {
                callback(err);
            }
        });
    }
    if(accion.action === "update"){
        DAOMedals.updateMedalQuestion(preg, accion.idMedal, accion.idOldMedal, function(err){
            if(err) {
                callback(err);
            }
        });
    }
    if(accion.action === "delete"){
        DAOMedals.deleteMedalQuestion(preg, accion.idMedal, function(err){
            if(err) {
                callback(err);
            }
        });
    }

}

module.exports={
    showQuestions(request, response) {
        var titulo = "Todas Las Preguntas";
        DAOQuestt.getQuestions(function(err, result) {
            let quests = new Array();
            if (err) {
                next(err);
            } else if (!result) {
                response.render("allQuest", { quests, titulo, error: null });
            } else {
                quests = giveFormatQuest(result, true);
                response.render("allQuest", { quests, titulo, error: null });
            }
        });
    },
    formQuestion(request, response) {
        response.render("newQuest", { titulo:null, error: null });
    },
    insertQuestion(request, response) {
        var lbls = request.body.labels;
        lbls = lbls.split ('@').filter(function(el) {return el.length != 0});
        if(lbls.length> 5) response.render("newQuest", { error: "Tienes un máximo de 5 tags." })
        else{
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            DAOQuestt.insertQuest(response.locals.userId, request.body.title, request.body.info, date, lbls, function(err, result) {
                if (err) {
                    next(err);
                } else if (!result) {
                    response.render("newQuest", {error: "Ya existe esa pregunta" });
                } else {
                    response.redirect("/");
                }
            });
        } 
    },
    search(request, response) {
        let text = request.body.texto;
        var titulo = "Resultados de la busqueda "+ "\"" + text + "\"";
        DAOQuestt.getQuestionsText(text, function(err, result) {
            let quests = new Array();
            if (err) {
                response.render("index");
            } else if (!result) {
                response.render("index");
            } else {
                quests = giveFormatQuest(result, true);
                response.render("allQuest", { quests, titulo, error: null });
            }
        })
    
    },
    insertAnswer(request, response) {
        let idp = request.params.id;
        var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        DAOQuestt.insertAnsw(request.body.respues, response.locals.userId, idp, date, function(err, result) {
            if (err) {
                next(err);
            } else {
                response.redirect("/index/showQuestions");
            }
        });
    },
    showNotAnswer(request, response) {
        var titulo = "Preguntas Sin Responder";
        DAOQuestt.getQuestionsNotAnswer(function(err, result) {
            let quests = new Array();
            if (err) {
                response.render("index");
            } else if (!result) {
                response.render("index");
            } else {
                quests = giveFormatQuest(result, true);
                response.render("allQuest", { quests, titulo, error: null });
            }
        })
    },
    showByTag(request, response, next) {
        let tag = request.params.tag;
        var titulo = "Preguntas con la etiqueta [" + tag + "]";
        DAOQuestt.getQuestions(function(err, result) {
            let quests = new Array();
            if (err) {
                next(err);
            } else if (!result) {
                response.render("allQuest", { quests, titulo, error: null });
            } else {
                quests = giveFormatQuest(result, true);
                quests = findByTag(quests, tag);
                response.render("allQuest", { quests, titulo, error: null });
            }
        });
    },
    viewQuest(request, response, next) {
        let id = request.params.id;
        console.log(id);
        var visitas;
        //obetener toda la informacion de una pregunta 
        DAOQuestt.get1Preg(id, function(err, result) {
            let preg = new Array();
            if (err) {
                next(err);
            } else if (!result) {
                console.log(preg.tags);
                response.render("infoQuest", {preg});
            } else {
                preg = giveFormatQuest(result, false);
                preg = preg[preg.length -1];
                //guardamos el numero de visitas antiguo
                let visitasAnt = preg.visitas;
                preg.visitas = preg.visitas + 1;
                
                DAOQuestt.getAnsw(preg.id, function(err, result){
                    if (err) {
                        console.log(preg.tags);
                        next(err);
                    }
                    else if(!result){
                        preg.respuesta = new Array();
                        console.log(preg.tags);
                        response.render("infoQuest", {preg});
                    } 
                    else{
                        resp = new Array();
                        result.forEach(e => {
                            d = new Date(e.fecha);
                            var date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                            resp.push({respuesta: e.respuesta, puntuacion: e.puntuacion, fecha: date, imagen: e.imagen, nickname: e.nickname});
                        });
                        preg.respuesta = resp;
                        response.render("infoQuest", {preg});
                    }
                });
                //actualizamos visitas en la bbdd
                DAOQuestt.increaseVisits(preg.id, preg.visitas, function(err){
                    if(err) {
                        console.log(err.message);
                    } else{
                        console.log("Visitas aumentadas con éxito");
                        //en este punto ya se ha añadido una visita y vamos a verificar si hay que cambiar su medalla
                        updateMedalQuestions(visitasAnt, preg.visitas, "visitas", preg.id, function(err){
                        if(err){
                            console.log(err.message);
                        } else console.log("Medalla actualizada con éxito");
                })
                    }
                })

                
            }
        });
    },
    viewUsers(request, response, next){
        DAOQuestt.getUsers(function(err, result) {
            let users = new Array();
            if (err) {
                next(err);
            } else if (!result) {
                response.render("users", { users });
            } else {
                console.log(result);
                users = giveFormatUser(result);
                console.log(users);
                response.render("users", { users });
            }
        });
    },
    //gestiona todas las opciones del boton upvote
    upVote(request, response){
        let usuario = response.locals.userId;
        let id = request.body.id;
        let pressed = request.body.pressed;
        let negative = request.body.negative;
        if(!pressed){
            DAOVotes.unvoteQuestion(id, usuario, function(err){
                if(err){
                    next(err);
                } else{
                    DAOQuestt.voteQuestion(id, -1, function(err, result){
                        if(err){
                            next(err);
                        } else{
                            DAOQuestt.getVotesQuestion(id, function(err, result){
                                if(err){
                                    next(err);
                                } else{
                                    let puntos = result[0].puntos;
                                    response.json({ resultado: puntos });
                                }
                            });
                        }
                    });
                } 
            });
        }
        else{           
            if(negative){
                DAOVotes.updatevoteQuestion(id, usuario, true, function(err){
                    if(err){
                        next(err);
                    } else{
                        DAOQuestt.voteQuestion(id, 2, function(err, result){
                            if(err){
                                next(err);
                            } else{
                                DAOQuestt.getVotesQuestion(id, function(err, result){
                                    if(err){
                                        next(err);
                                    } else{
                                        let puntos = result[0].puntos;
                                        response.json({ resultado: puntos });
                                    }
                                });
                            }
                        });
                    } 
                });
            }
            else{
                DAOVotes.upvoteQuestion(id, usuario, function(err){
                    console.log(id);
                    if(err){
                        next(err);
                    } else{
                        DAOQuestt.voteQuestion(id, 1, function(err, result){
                            if(err){
                                next(err);
                            } else{
                                DAOQuestt.getVotesQuestion(id, function(err, result){
                                    if(err){
                                        next(err);
                                    } else{
                                        let puntos = result[0].puntos;
                                        response.json({ resultado: puntos });
                                    }
                                });
                            }
                        });
                    } 
                });
            }
        } 
    },
    //gestiona todas las opciones del boton downvote
    downVote(request, response){
        let usuario = response.locals.userId;
        let id = request.body.id;
        let pressed = request.body.pressed;
        let positive = request.body.positive;
        if(!pressed){
            DAOVotes.unvoteQuestion(id, usuario, function(err){
                if(err){
                    next(err);
                } else{
                    DAOQuestt.voteQuestion(id, 1, function(err, result){
                        if(err){
                            next(err);
                        } else{
                            DAOQuestt.getVotesQuestion(id, function(err, result){
                                if(err){
                                    next(err);
                                } else{
                                    let puntos = result[0].puntos;
                                    response.json({ resultado: puntos });
                                }
                            });
                        }
                    });
                } 
            });
        }
        else{           
            if(positive){
                DAOVotes.updatevoteQuestion(id, usuario, false, function(err){
                    if(err){
                        next(err);
                    } else{
                        DAOQuestt.voteQuestion(id, -2, function(err, result){
                            if(err){
                                next(err);
                            } else{
                                DAOQuestt.getVotesQuestion(id, function(err, result){
                                    if(err){
                                        next(err);
                                    } else{
                                        let puntos = result[0].puntos;
                                        response.json({ resultado: puntos });
                                    }
                                });
                            }
                        });
                    } 
                });
            }
            else{
                DAOVotes.downvoteQuestion(id, usuario, function(err){
                    if(err){
                        next(err);
                    } else{
                        DAOQuestt.voteQuestion(id, -1, function(err, result){
                            if(err){
                                next(err);
                            } else{
                                DAOQuestt.getVotesQuestion(id, function(err, result){
                                    if(err){
                                        next(err);
                                    } else{
                                        let puntos = result[0].puntos;
                                        response.json({ resultado: puntos });
                                    }
                                });
                            }
                        });
                    } 
                });
            }
        } 
    }
}