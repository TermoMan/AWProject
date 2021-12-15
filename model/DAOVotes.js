const getpool = require("../config.js");
const pool = getpool();
class DAOVotes {
  
  upvoteQuestion(idPregunta, idUsuario, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error pool"));
      } else {
        connection.query(
          "INSERT INTO votospreg VALUES(?,?,1)",
          [idUsuario, idPregunta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null);
            }
          }
        );
      }
    });
  }

  downvoteQuestion(idPregunta, idUsuario, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error pool"));
      } else {
        connection.query(
          "INSERT INTO votospreg VALUES(?,?,-1)",
          [idUsuario, idPregunta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null);
            }
          }
        );
      }
    });
  }

  unvoteQuestion(idPregunta, idUsuario, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error pool"));
      } else {
        connection.query(
          "DELETE FROM votospreg WHERE idusuario= ? AND idpregunta=?",
          [idUsuario, idPregunta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null);
            }
          }
        );
      }
    });
  }
 updatevoteQuestion(idPregunta, idUsuario, positivo, callback){
  pool.getConnection(function (err, connection) {
    if (err) {
      callback(new Error("Error pool"));
    } else {
      connection.query(
        "UPDATE votospreg SET positivo = ? WHERE idusuario= ? AND idpregunta=?",
        [positivo, idUsuario, idPregunta],
        function (err, rows) {
          connection.release(); // devolver al pool la conexión
          if (err) {
            callback(new Error("Error de acceso a la base de datos"));
          } else {
            callback(null);
          }
        }
      );
    }
  });
  }

  upvoteAnswer(idRespuesta, idUsuario, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error pool"));
      } else {
        connection.query(
          "INSERT INTO votosres VALUES(?,?,1)",
          [idUsuario, idRespuesta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null);
            }
          }
        );
      }
    });
  }

  downvoteAnswer(idRespuesta, idUsuario, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error pool"));
      } else {
        connection.query(
          "INSERT INTO votosres VALUES(?,?,-1)",
          [idUsuario, idRespuesta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null);
            }
          }
        );
      }
    });
  }

  unvoteAnswer(idRespuesta, idUsuario, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error pool"));
      } else {
        connection.query(
          "DELETE FROM votosres WHERE idusuario= ? AND idrespuesta=?",
          [idUsuario, idRespuesta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null);
            }
          }
        );
      }
    });
  }

  updatevoteAnswer(idRespuesta, idUsuario, positivo, callback){
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error pool"));
      } else {
        connection.query(
          "UPDATE votosres SET positivo = ? WHERE idusuario= ? AND idrespuesta=?",
          [positivo, idUsuario, idRespuesta],
          function (err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null);
            }
          }
        );
      }
    });
    }
}
module.exports = DAOVotes;
