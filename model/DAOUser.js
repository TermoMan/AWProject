const getpool = require("../config.js");
const pool = getpool();

class DAOUser {
    isUser(email, password, callback) {
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            } else {
                connection.query("SELECT * FROM usuario WHERE correo = ? AND contraseña = ?", [email, password],
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
    register(email, password, nickname, img, date, callback){
        pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error pool"));
            } else {
                connection.query(
                    "SELECT correo FROM usuario WHERE correo = ?",
                    [email],
                    function (err, rows) {
                        if (err) {
                          connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else if (rows.length !== 0) {
                          connection.release();
                            callback(null, false);
                        } else {
                            connection.query("INSERT INTO usuario (correo, contraseña, nickname, imagen, fecha, reputacion, activo) VALUES (?,?,?,?,?,1,1)",
                            [email, password, nickname, img, date],
                                function(err, rows) {
                                    connection.release(); // devolver al pool la conexión
                                    if (err) {
                                        console.log(err);
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
}

module.exports = DAOUser;