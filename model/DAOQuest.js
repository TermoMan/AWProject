const getpool = require("../config.js");
const pool = getpool();

class DAOQuest {
    getQuestions(callback) {
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            } else {
                connection.query("SELECT * FROM preguntas JOIN usuario ON preguntas.idusuario = usuario.idusuario", [],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            } else {
                                callback(null, rows);
                            }
                        }
                    });
            }
        });
    }
}

module.exports = DAOQuest;