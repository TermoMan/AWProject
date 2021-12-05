const getpool = require("../config.js");
const pool = getpool();

class DAOQuest {
    getQuestions(callback) {
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            } else {
                connection.query("SELECT pr.idpregunta, pr.titulo, pr.cuerpo, pr.fecha, t.texto, u.nickname, u.imagen FROM ((preguntas pr LEFT JOIN tagpreg tp ON pr.idpregunta = tp.idpregunta) LEFT JOIN tags t ON t.idtag=tp.idtag) LEFT JOIN usuario u ON pr.idusuario = u.idusuario", [],
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