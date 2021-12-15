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
            idusuario: e.idusuario,
            id: e.idpregunta,
            valor: e.voto,
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
    var arr = new Array();
    result.forEach(e => {
        if(e.tags !== null) arr = e.tags.split(',');
        else arr = new Array();
        users.push({
            id: e.idusuario,
            name: e.nickname,
            imagen: e.imagen,
            reputacion: e.reputacion,
            tag: arr
        });
    });
    return users;
}

function getCommonTag(tags){
    var max = 0;
    var tagP = null;
    let elems2 = new Array();
    let count = new Array();
    if(tags.length){
        tags.sort((a,b)=>{
            if (a == b) return 0;
            else if (a < b) return -1;
            else return 1;
        });
        let tag = tags.shift();
        elems2.push(tag);
        count.push(1);
        tags.forEach(ele=>{
            tag=elems2[elems2.length -1];
            if(ele===tag) {
                let n = count.pop() + 1;
                count.push(n);
            }else {
                elems2.push(ele);
                count.push(1);
            }
        });
        max = Math.max.apply(null, count);
        let i = count.indexOf(max);
        tagP = elems2[i];
    }
    return tagP;
}

function formatMedals(puntos, format){
    let arr = new Array();
    let med = new Array();
    let times = new Array();
    let arrFin = new Array();
    if(puntos !== null) arr = puntos.split(',');
    arr.forEach(e=>{
        let num = medals.getMedalId(e,format);
        if(num!==-1) {
            elem = medals.array[num].nombre;
            let i = med.indexOf(elem);
            if(i === -1){
                med.push(elem);
                times.push(1);
            }else{
                times[i] = times[i]+1;
            }
        }
    });
    arr = med.map((e,i) => [e,times[i]]);
    arr.forEach(e=>{
        index = medals.array.map(el => el.nombre).indexOf(e[0]);
        arrFin.push({
            text: e[0],
            times: e[1],
            type: medals.array[index].tipo
        });
    })
    return arrFin;
}

function formatMedalsType(medP, medR, medV){
    var type = [[],[],[]];
    medP.forEach(e=>{
        if(e.type === 1) type[0].push(e);
        if(e.type === 2) type[1].push(e);
        if(e.type === 3) type[2].push(e);
    });
    medR.forEach(e=>{
        if(e.type === 1) type[0].push(e);
        if(e.type === 2) type[1].push(e);
        if(e.type === 3) type[2].push(e);
    });
    medV.forEach(e=>{
        if(e.type === 1) type[0].push(e);
        if(e.type === 2) type[1].push(e);
        if(e.type === 3) type[2].push(e);
    });
    return type;
}

function findByTag(quests, tag){
    let tagQuests = quests.filter(q => 
        q.tags.includes(tag));
    return tagQuests;
}

function updateMedalQuestions(visitasAnt, visitasNew, tipo, preg, callback){
    let accion = medals.actionmedal(visitasAnt, visitasNew, tipo);
    let fecha = new Date()
    if(accion.action === "insert"){
        DAOMedals.insertMedalQuestion(preg, accion.idMedal, fecha, function(err){
            if(err) {
                callback(err);
            }
        });
    }
    if(accion.action === "update"){
        DAOMedals.updateMedalQuestion(preg, accion.idMedal, accion.idOldMedal, fecha, function(err){
            if(err) {
                callback(err);
            }
        });
    }
    if(accion.action === "delete"){
        DAOMedals.deleteMedalQuestion(preg, accion.idOldMedal, function(err){
            if(err) {
                callback(err);
            }
        });
    }

}

function updateMedalAnswer(votosAnt, votosNew, tipo, answer, callback){
    let accion = medals.actionmedal(votosAnt, votosNew, tipo);
    let fecha = new Date();
    if(accion.action === "insert"){
        DAOMedals.insertMedalAnswer(answer, accion.idMedal, fecha, function(err){
            if(err) {
                callback(err);
            }
        });
    }
    if(accion.action === "update"){
        DAOMedals.updateMedalAnswer(answer, accion.idMedal, accion.idOldMedal, fecha, function(err){
            if(err) {
                callback(err);
            }
        });
    }
    if(accion.action === "delete"){
        DAOMedals.deleteMedalAnswer(answer, accion.idOldMedal, function(err){
            if(err) {
                callback(err);
            }
        });
    }

}

module.exports={
    showQuestions(request, response, next) {
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
    insertQuestion(request, response, next) {
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
    insertAnswer(request, response, next) {
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
        DAOQuestt.get1Preg(id, response.locals.userId, function(err, result) {
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
                
                DAOQuestt.getAnsw(preg.id, response.locals.userId, function(err, result){
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
                            resp.push({idrespuesta: e.idrespuesta, respuesta: e.respuesta, positivo: e.positivo, votos: e.puntos, fecha: date, imagen: e.imagen, nickname: e.nickname});
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
            var titulo = "Usuarios";
            if (err) {
                next(err);
            } else if (!result) {
                response.render("users", {titulo, users });
            } else {
                users = giveFormatUser(result);
                users.forEach( e=>{
                    let tag = getCommonTag(e.tag);
                    if(tag!==null) e.tag = tag;
                });
                response.render("users", {titulo, users });
            }
        });
    },
    searchUsers(request, response, next) {
        let text = request.body.texto;
        var titulo = "Usuarios filtrados por "+ "\"" + text + "\"";
        DAOQuestt.getUsersText(text, function(err, result) {
            let users = new Array();
            if (err) {
                next(err);
            } else if (!result) {
                response.render("users", {titulo, users });
            } else {
                users = giveFormatUser(result);
                users.forEach( e=>{
                    let tag = getCommonTag(e.tag);
                    if(tag!==null) e.tag = tag;
                });
                response.render("users", {titulo, users });
            }
        });
    },

    viewUserInfo(request,response, next){
        let id = request.params.id;
        let user = null;
        let medP = new Array();
        let medR = new Array();
        DAOQuestt.viewUserInfo(id, function(err,result){
            if(err){
                next(err);
            } else if(!result){
                response.render("userProfile", {user})
            } else{
                user = result[0];
                d = new Date(user.fecha);
                var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                medP = formatMedals(user.puntPreg, "votos-pregunta");
                medR = formatMedals(user.puntResp, "votos-respuesta");
                medV = formatMedals(user.visitPreg, "visitas");
                medType = formatMedalsType(medP, medR, medV);
                user = {
                    nickname: user.nickname,
                    imagen: user.imagen,
                    fecha: datestring,
                    reputacion: user.reputacion,
                    numPregs: user.numPregs,
                    numResp: user.numResp,
                    medals: medType
                };
                console.log(user);
                response.render("userProfile", {user})
            }
        })
    },
    //gestiona todas las opciones del boton upvote
    vote(request, response, next){
        let usuario = response.locals.userId;
        let id = request.body.id;
        let pressed = request.body.pressed;
        let oposite = request.body.oposite;
        let num = request.body.change;
        if(request.body.question){
            if(!pressed){
                DAOVotes.unvoteQuestion(id, usuario, function(err){
                    if(err){
                        next(err);
                    } else{
                        num = num* -1;
                        DAOQuestt.voteQuestion(id, num, function(err, result){
                            if(err){
                                next(err);
                            } else{
                                DAOQuestt.getVotesQuestion(id, function(err, result){
                                    if(err){
                                        next(err);
                                    } else{
                                        let puntos = result[0].puntos;
                                        updateMedalQuestions(puntos + num, puntos, "votos-pregunta", id, function(err){
                                            if(err){
                                                console.log(err.message);
                                            } else console.log("Medallas actualizadas con éxito");
                                        });
                                        response.json({ resultado: puntos, idVotos:"pregPuntos" });
                                    }
                                });
                            }
                        });
                    } 
                });
            }
            else{           
                if(oposite){
                    DAOVotes.updatevoteQuestion(id, usuario, num, function(err){
                        if(err){
                            next(err);
                        } else{
                            num = num *2;
                            DAOQuestt.voteQuestion(id, num, function(err, result){
                                if(err){
                                    next(err);
                                } else{
                                    DAOQuestt.getVotesQuestion(id, function(err, result){
                                        if(err){
                                            next(err);
                                        } else{
                                            let puntos = result[0].puntos;
                                            updateMedalQuestions(puntos - num, puntos, "votos-pregunta", id, function(err){
                                                if(err){
                                                    console.log(err.message);
                                                } else console.log("Medallas actualizadas con éxito");
                                            });
                                            response.json({ resultado: puntos, idVotos:"pregPuntos" });
                                        }
                                    });
                                }
                            });
                        } 
                    });
                }
                else{
                    DAOVotes.upvoteQuestion(id, usuario, function(err){
                        if(err){
                            next(err);
                        } else{
                            DAOQuestt.voteQuestion(id, num, function(err, result){
                                if(err){
                                    next(err);
                                } else{
                                    DAOQuestt.getVotesQuestion(id, function(err, result){
                                        if(err){
                                            next(err);
                                        } else{
                                            let puntos = result[0].puntos;
                                            updateMedalQuestions(puntos - num, puntos, "votos-pregunta", id, function(err){
                                                if(err){
                                                    console.log(err.message);
                                                } else console.log("Medallas actualizadas con éxito");
                                            });
                                            response.json({ resultado: puntos, idVotos:"pregPuntos" });
                                        }
                                    });
                                }
                            });
                        } 
                    });
                }
            }
        } else{
            if(!pressed){
                DAOVotes.unvoteAnswer(id, usuario, function(err){
                    if(err){
                        next(err);
                    } else{
                        num = num*-1;
                        DAOQuestt.voteAnswer(id, num, function(err, result){
                            if(err){
                                next(err);
                            } else{
                                DAOQuestt.getVotesAnswer(id, function(err, result){
                                    if(err){
                                        next(err);
                                    } else{
                                        let idVotos = id + "-votos";
                                        let puntos = result[0].puntos;
                                        num = num*-1;
                                        updateMedalAnswer(puntos + num, puntos, "votos-respuesta", id, function(err){
                                            if(err){
                                                console.log(err.message);
                                            } else console.log("Medallas actualizadas con éxito");
                                        });
                                        response.json({ resultado: puntos, idVotos: idVotos });
                                    }
                                });
                            }
                        });
                    } 
                });
            }
            else{           
                if(oposite){
                    DAOVotes.updatevoteAnswer(id, usuario, num, function(err){
                        if(err){
                            next(err);
                        } else{
                            num = num*2;
                            DAOQuestt.voteAnswer(id, num, function(err, result){
                                if(err){
                                    next(err);
                                } else{
                                    DAOQuestt.getVotesAnswer(id, function(err, result){
                                        if(err){
                                            next(err);
                                        } else{
                                            let idVotos = id + "-votos";
                                            let puntos = result[0].puntos;
                                            updateMedalAnswer(puntos - num, puntos, "votos-respuesta", id, function(err){
                                                if(err){
                                                    console.log(err.message);
                                                } else console.log("Medallas actualizadas con éxito");
                                            });
                                            response.json({ resultado: puntos, idVotos: idVotos });
                                        }
                                    });
                                }
                            });
                        } 
                    });
                }
                else{
                    DAOVotes.upvoteAnswer(id, usuario, function(err){
                        console.log(id);
                        if(err){
                            next(err);
                        } else{
                            DAOQuestt.voteAnswer(id, num, function(err, result){
                                if(err){
                                    next(err);
                                } else{
                                    DAOQuestt.getVotesAnswer(id, function(err, result){
                                        if(err){
                                            next(err);
                                        } else{
                                            let idVotos = id + "-votos";
                                            let puntos = result[0].puntos;
                                            updateMedalAnswer(puntos - num, puntos, "votos-respuesta", id, function(err){
                                                if(err){
                                                    console.log(err.message);
                                                } else console.log("Medallas actualizadas con éxito");
                                            });
                                            response.json({ resultado: puntos, idVotos: idVotos });
                                        }
                                    });
                                }
                            });
                        } 
                    });
                }
            }
        }
    },
}