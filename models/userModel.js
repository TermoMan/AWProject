const { getPool } = require("../database");
const { compare, hash } = require("bcrypt");

const SALT_ROUNDS = 12;

class userModel{

    insertUser(username, password, email, image, callback) {
      getPool().getConnection(function (err, connection) {
          if (err) {
              callback(new Error("Error de conexión a la base de datos"));
          } else {
              connection.query(
                  "SELECT username, email FROM users WHERE username = ? OR email = ?",
                  [username, email],
                  function (err, rows) {
                      if (err) {
                        connection.release();
                          callback(new Error("Error de acceso a la base de datos"));
                      } else if (rows.length !== 0) {
                        connection.release();
                          callback(null, false);
                      } else {
                        hash(password, SALT_ROUNDS, (err, pwd) => {
                          if (err) {
                            connection.release();
                            return callback(new Error("Error al encriptar la contraseña"));
                          }
                          connection.query(
                            "INSERT INTO users (username,password,email,image, status) VALUES ( ?, ?, ?, ?, 1) ",
                            [username, pwd, email, image], function (err, rows) {
                                connection.release();
                                if (err) {
                                    callback(new Error("Error al insertar en la base de datos"));
                                } else {
                                    callback(null, true);
                                }
                            }
                        );
                        });
                          
                      }
                  }
              );
          }
      });
    }

    checkUser(text, password, callback) {
        getPool().getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM users WHERE email = ? OR username = ?",
                    [text, text],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); 
                            }
                            else {
                                const encryptedPwd = rows[0].password;
                                compare(password, encryptedPwd, (err, same) => {
                                  if (err) {
                                    return callback((new Error("Error al comparar contraseñas")));
                                  }
                                  if (!same) {
                                    return callback(null, false);
                                  }
                                  callback(null, rows);
                                });
                            }
                        }
                    });
            }
        });
    }
}

module.exports = userModel;

