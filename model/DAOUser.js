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
}

module.exports = DAOUser;