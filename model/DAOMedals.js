const getpool = require("../config.js");
const pool = getpool();

class DAOMedals {
    updateMedalQuestion(idpregunta, idmedalla, idOldMedal, fecha, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("UPDATE medallaspreg SET idmedalla=?, fecha=? WHERE idpregunta=? AND idmedalla = ?",
                [idmedalla, fecha, idpregunta, idOldMedal],
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

    insertMedalQuestion(idpregunta, idmedalla, fecha, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("INSERT INTO medallaspreg VALUES(?,?,?)",
                [idpregunta, idmedalla, fecha],
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

    updateMedalAnswer(idrespuesta, idmedalla, idOldMedal, fecha, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("UPDATE medallasres SET idmedalla=?, fecha=? WHERE idrespuesta=? AND idmedalla = ?",
                [idmedalla, fecha, idrespuesta, idOldMedal],
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

    deleteMedalAnswer(idpregunta, idmedalla, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("DELETE FROM medallasres WHERE idrespuesta = ? AND idmedalla = ?",
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

    insertMedalAnswer(idrespuesta, idmedalla, fecha, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            }else {
                connection.query("INSERT INTO medallasres VALUES(?,?,?)",
                [idrespuesta, idmedalla, fecha],
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