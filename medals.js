
//el tipo indica si oro(3) plata(2) o bronce(1)
let medals = [
    {tipo: 1, nombre: "Pregunta popular"},
    {tipo: 2, nombre: "Pregunta destacada"},
    {tipo: 3, nombre: "Pregunta famosa"},
    {tipo: 1, nombre: "Estudiante"},
    {tipo: 1, nombre: "Pregunta interesante"},
    {tipo: 2, nombre: "Buena Pregunta"},
    {tipo: 3, nombre: "Excelente Pregunta"},
    {tipo: 1, nombre: "Respuesta interesante"},
    {tipo: 2, nombre: "Buena respuesta"},
    {tipo: 3, nombre: "Excelente respuesta"},
]


//comprueba segun se valora una pregunta o respuesta cual es el caso para calcular la medalla correspondiente
function getMedalId(num, tipo){

    switch(tipo){
        case "visitas":  return getMedalVisitas(num);
        case "votos-pregunta": return getMedalVotosPreg(num);
        case "votos-respuesta": return getMedalVotosRes(num);
    }

}
    //retorna el id de las medallas por visitas a preguntas
function getMedalVisitas(num){

    switch(true){
        case (num  >= 2 && num < 4): return 0;
        case (num >= 4 && num < 6):  return 1;
        case (num >= 6): return 2;
        default: return -1;
    }

}
    //retorna el id de las medallas por pregunta votada
function getMedalVotosPreg(num){

    switch(true){
        case (num == 1): return 3;
        case (num  >= 2 && num < 4): return 4;
        case (num >= 4 && num < 6):  return 5;
        case (num >= 6): return 6;
        default: return -1;
    }

}

    //retorna el id de las medallas por respuesta votada
function getMedalVotosRes(num){

    switch(true){
        case (num  >= 2 && num < 4): return 7;
        case (num >= 4 && num < 6):  return 8;
        case (num >= 6): return 9;
        default: return -1;
    }

}

//calculamos antigua y nueva medlla y retornamos la nueva medalla con la accion correspondiente
function actionmedal(dataOld, dataNew, tipo){
    let oldMedal = getMedalId(dataOld, tipo);
    let newMedal = getMedalId(dataNew, tipo);
    let action;
    
    if(oldMedal != newMedal){
        if(newMedal === -1) action = "delete";
        if(oldMedal === -1) action = "insert";
        else action = "update";
    }

    return {action: action,idMedal: newMedal, idOldMedal:oldMedal};
}

module.exports = {
    getMedalId: getMedalId,
    array: medals,
    actionmedal: actionmedal
}