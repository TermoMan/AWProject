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
    insertQuest(userId, title, info, date, lbls, callback) {
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT into preguntas (idusuario,titulo,cuerpo,fecha,puntos,visitas) VALUES (?,?,?,?,0,0)", [userId, title, info, date],
                    function(err, rows) {
                        console.log(err);
                        var pregId = rows.insertId;
                        if (err) {
                            connection.release(); // devolver al pool la conexión
                            callback(new Error("Error de acceso a la base de datos"));
                        } else if (lbls.length > 0) {
                            var ar = lbls;
                            let query = "INSERT IGNORE into tags (texto) VALUES ('" + ar[0] + "')";
                            for (let i = 1; i < ar.length; ++i) {
                                query += ", ('" + ar[i] + "')";
                            }
                            connection.query(query,
                                function(err) {
                                    if (err) {
                                        connection.release(); // devolver al pool la conexión
                                        callback(new Error("Error de acceso a la base de datos"));
                                    } else {
                                        let query = "SELECT tags.idtag FROM tags WHERE texto IN ('" + ar[0] + "'";
                                        for (let i = 1; i < ar.length; ++i) {
                                            query += ", '" + ar[i] + "'";
                                        }
                                        query += ")";
                                        connection.query(query,
                                            function(err, rows) {
                                                if (err) {
                                                    connection.release(); // devolver al pool la conexión
                                                    callback(new Error("Error de acceso a la base de datos"));
                                                } else {
                                                    let query = "INSERT into tagpreg (idpregunta, idtag) VALUES ('" + pregId + "', " + rows[0].idtag + ")";
                                                    for (let i = 1; i < rows.length; ++i) {
                                                        query += ", ('" + pregId + "', " + rows[i].idtag + ")"
                                                    }
                                                    connection.query(query, function(err) {
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
                                });
                        }
                    });
            }
        });
    }

    getQuestionsText(text, callback) {
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            } else {
                connection.query("SELECT pr.idpregunta, pr.titulo, pr.cuerpo, pr.fecha, t.texto, u.nickname, u.imagen FROM ((preguntas pr LEFT JOIN tagpreg tp ON pr.idpregunta = tp.idpregunta) LEFT JOIN tags t ON t.idtag=tp.idtag) LEFT JOIN usuario u ON pr.idusuario = u.idusuario WHERE pr.titulo LIKE '%?%'", [text],
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