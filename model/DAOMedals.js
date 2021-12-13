const getpool = require("../config.js");
const pool = getpool();

class DAOMedals {
    updateMedalQuestion(idpregunta, idmedalla, idOldMedal, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("UPDATE medallaspreg SET idmedalla=? WHERE idpregunta=? AND idmedalla = ?",
                [idmedalla, idpregunta, idOldMedal],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            callback(null, true);
                        }
                    });
            }
        });
    }

    deleteMedalQuestion(idpregunta, idmedalla, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("DELETE FROM medallaspreg WHERE idpregunta = ? AND idmedalla = ?",
                [idpregunta, idmedalla],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            callback(null, true);
                        }
                    });
            }
        });
    }

    insertMedalQuestion(idpregunta, idmedalla, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("INSERT INTO medallaspreg VALUES(?,?)",
                [idpregunta, idmedalla],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            callback(null, true);
                        }
                    });
            }
        });
    }

}

module.exports = DAOMedals;