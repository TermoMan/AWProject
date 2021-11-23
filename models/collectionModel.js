const { getPool } = require("../database");

class collectionModel {
  insertCollection(owner_id, name, description, image, privat, callback) {
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT name FROM collections WHERE name = ? ",
          [name],
          function (err, rows) {
            if (err) {
              connection.release();
              callback(new Error("Error al insertar una nueva colección"));
            } else if (rows.length != 0) {
              connection.release();
              callback(null, false);
            } else {
              connection.query(
                "INSERT INTO collections (owner_id, name, description, image, privat) VALUES ( ?, ?, ?, ?, ?) ",
                [owner_id, name, description, image, privat],
                (err) => {
                  connection.release();
                  if (err) {
                    return callback(
                      new Error("Error al insertar una nueva colección")
                    );
                  }
                  callback(null, true);
                }
              );
            }
          }
        );
      }
    });
  }
  checkCollection(collection_id, user_id, callback) {
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT id FROM collections WHERE id=? AND owner_id=?", //Se comprueba si existe la colección
          [collection_id, user_id],
          function (err, rows) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              if (rows.length == 0) {
                callback(null, false);
              } else {
                callback(null, true);
              }
            }
          }
        );
      }
    });
  }
  insertCollectionItem(collection_id, name, description, images, privat, callback) {
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de acceso a la base de datos"));
      } else {
        connection.query(
          "SELECT id FROM collection_items WHERE name = ? AND collection_id = ?",
          [name, collection_id],
          (err, rows) => {
            if (err) {
              connection.release();
              callback(
                new Error("Error al insertar un nuevo item en la colección")
              );
            } else if (rows.length != 0) {
              connection.release();
              callback(null, false);
            } else {
              connection.query(
                "INSERT INTO collection_items (collection_id, name, description, privat) VALUES (?,?,?,?)",
                [collection_id, name, description, privat],
                function (err, result) {
                  var itemID = result.insertId;
                  if (err) {
                    connection.release();
                    callback(
                      new Error(
                        "Error al insertar un nuevo item en la colección"
                      )
                    );
                  } else if (!images || images.length == 0) {
                    connection.release();
                    callback(null, true);
                  } else {
                    const values = [];
                    images.forEach((imgName) => {
                      values.push(itemID, imgName.name);
                    });
                    const sql = `
                      INSERT INTO collection_item_images (collection_item_id, image)
                      VALUES ${"(?,?) "
                        .repeat(images.length)
                        .trim()
                        .split(" ")
                        .join(",")}`;
                    connection.query(sql, values, function (err, r) {
                      connection.release();
                      if (err) {
                        callback(
                          new Error("Error al insertar una imagen del item")
                        );
                      } else {
                        callback(null, true);
                      }
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  }
  getCollectionImage(collection_id, callback){
    getPool().getConnection(function (err, connection){
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }else{
        connection.query(
          "SELECT image FROM collections WHERE id = ?",
          [collection_id],
          function (err, row) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else { //Existe esa coleccion          
              callback(null, row);
            }
          }
        );
      }
    });
  }
  getCollectionItemsImages(collection_id, callback){
    getPool().getConnection(function (err, connection){
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }else{
        connection.query(
          "SELECT collection_item_images.image FROM collection_item_images JOIN collection_items ON collection_item_images.collection_item_id = collection_items.id JOIN collections ON collection_items.collection_id = collections.id WHERE collections.id = ?",
          [collection_id],
          function (err, rows) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else { //Existe esa coleccion          
              callback(null, rows);
            }
          }
        );
      }
    });
  }   
    listUserCollections(user_id, callback) {
      getPool().getConnection(function (err, connection) {
        if (err) {
          callback(new Error("Error de conexión a la base de datos"));
        } else {
          //Se obtiene de la base de datos todas las colecciones del usuario con id = user_id
          connection.query(
            "SELECT id, name, description, image FROM collections WHERE owner_id = ? ORDER BY name ASC",
              [user_id],
              function (err, rows) {
                connection.release();
                if (err) {
                  callback(new Error("Error de acceso a la base de datos"));
                } else {
                  callback(null, rows);
                }
              }
            
          );
        }
       
      });
      
    }

    deleteCollection(user_id, id, callback) {
      getPool().getConnection(function (err, connection) {
        if (err) {
          callback(new Error("Error de conexión a la base de datos"));
        } else {
          connection.query( //comprobar que el id existe
            "Select id FROM collections WHERE id =?",
            [id],
            function (err, rows) {
              if (err) {
                connection.release();
                callback(new Error("Error de acceso a la base de datos"));
              } else if(rows.length == 0){ //No existe la coleccion
                connection.release();
                callback(null, false);
              }else {
                connection.query( //Selección del id de la colección para devolverlo en rows, necesario para el redirect
                  "Select id FROM collections WHERE id =? AND owner_id = ?",
                  [id, user_id],
                  function (err, rows) {
                    if (err) {
                      connection.release();
                      callback(new Error("Error de acceso a la base de datos"));
                    } else if(rows.length == 0){ //El propietario no coincide
                      connection.release();
                      callback(null, false);
                    }else{
                      connection.query( // Eliminación de elementos de la coleccion
                        "DELETE FROM collection_items WHERE collection_id=? AND owner_id = ?",
                        [id, user_id], (err) => {
                          if (err) {
                            connection.release();
                            return callback(err);
                          }
                          connection.query( // Eliminación de la coleccion
                            "DELETE FROM collections WHERE id = ? AND owner_id = ?",
                            [id, user_id], (err) => {
                              connection.release();
                              if (err) {
                                return callback(err);
                              }
                              callback(null, true);
                            });
                        });
                    }
                  })
                }
              }
          );
        }
        
      });
    }
    listCollectionItems(collection_id, user_id, callback) {
      getPool().getConnection(function (err, connection) {
        if (err) {
          callback(new Error("Error de conexión a la base de datos"));
        } else {
          //Se comprueba si la colección a la que el usuario intenta acceder es suya
          connection.query(
            "SELECT name FROM collections WHERE owner_id=? AND id=?",
            [user_id, collection_id],
            function (err, rows) {
              if (err) {
                connection.release();
                callback(new Error("Error de acceso a la base de datos"));
  
              } else if (rows.length == 0) {
                //La colección no es del usuario
                connection.query(
                  "SELECT privat FROM collections WHERE id=?",
                  [collection_id],
                  function(err, row){
                    if(row[0].privat){
                      //La colección es privada
                      connection.release();
                      callback(null, false, false, true);
                    }
                    else{
                      //La colección es publica
                      connection.query(

                        "SELECT I.privat, I.id, I.name, I.description, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.collection_id = ? GROUP BY I.name ORDER BY I.name ASC",


                        [collection_id],
                        function (err, itemsRows) {
                          connection.release();
                          if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                          } else {
                            callback(null, itemsRows, false, false);
                          }
                        }
                      );
                    }
                  }
                );
  
              } else {
                //La colección sí es del usuario --> se obtienen los elementos de la colección y sus imágenes
                connection.query(

                  "SELECT I.privat, I.id, I.name, I.description, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.collection_id = ? GROUP BY I.name ORDER BY I.name ASC",

                  [collection_id],
                  function (err, itemsRows) {
                    connection.release();
                    if (err) {
                      callback(new Error("Error de acceso a la base de datos"));
                    } else {
                      callback(null, itemsRows, true, null);
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  viewItemDetails(item_id, owner_id, callback) {
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de acceso a la base de datos"));
      } else {
        //Se comprueba si existe el elemento
        connection.query(
          "SELECT collection_id FROM collection_items WHERE id =?",
          [item_id],
          function (err, rows) {
            if (err) {
              callback(new Error("Error de acceso a la base de datos" + err));
            } else if (rows.length == 0) {  //No existe ese item en la coleccion
              callback(null, false, false, true, null);
            } else {
              connection.query(
                "SELECT C.id,C.owner_id,C.privat,I.privat AS itempriv FROM collection_items I JOIN collections C on I.collection_id = C.id WHERE I.id = ?", // consulta para el owner
                [item_id],
                function (err, rows) {
                  if (err) {  //Error
                    connection.release();
                    callback(new Error("Error de acceso a la base de datos"));

                  } else if (rows[0].owner_id != owner_id) {  //No es el propietario

                    if (rows[0].privat === 1) { //Coleccion privada
                      connection.release();
                      callback(null, false, false, true, null); //err, rows, propiet, colpriv, itempriv
                    }
                    else if (rows[0].privat === 0 && rows[0].itempriv === 1) { //Coleccion publica pero item privado
                      connection.release();
                      callback(null, false, false, false, true);
                    }
                    else { //Coleccion publica item publico
                      connection.query(
                        "SELECT I.id, I.name, I.description, I.privat, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.id=?",
                        [item_id],
                        function (err, rows) {
                          connection.release();
                          if (err) {
                            callback(
                              new Error("Error de acceso a la base de datos")
                            );
                          } else {
                            //Existe ese item
                            callback(null, rows, false, false, false);
                          }
                        }
                      );
                    }

                  } else { //Es el propietario
                    connection.query(
                      "SELECT I.id, I.name, I.description, I.privat, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.id=?",
                      [item_id],
                      function (err, rows) {
                        connection.release();
                        if (err) {
                          callback(
                            new Error("Error de acceso a la base de datos")
                          );
                        } else {
                          //Existe ese item
                          callback(null, rows, true, null, rows[0].privat);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  }
  listUserCollections(user_id, callback) {
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        //Se obtiene de la base de datos todas las colecciones del usuario con id = user_id
        connection.query(
          "SELECT * FROM collections WHERE owner_id = ? ORDER BY name ASC",
          [user_id],
          function (err, rows) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, rows);
            }
          }

        );
      }
    });
  }
  getItemImages(item_id, callback){
    getPool().getConnection(function (err, connection){
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      }else{
        connection.query(
          "SELECT GROUP_CONCAT(M.image) AS images, count(M.collection_item_id) AS num FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.id=?",
          [item_id],
          function (err, rows) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else { //Existe ese item          
              callback(null, rows);
            }
          }
        );
      }
    });
  }
  deleteItem(user_id, id, callback) {
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query( //comprobar que el id existe
          "Select collection_id FROM collection_items WHERE id =?",
          [id],
          function (err, rows) {
            if (err) {
              connection.release();
              callback(new Error("Error de acceso a la base de datos"));
            } else if(rows.length == 0){ //No existe el item
              connection.release();
              callback(null, false);
            }else {
              connection.query( //Selección del id de la colección para devolverlo en rows, necesario para el redirect
                "Select I.collection_id FROM collection_items I JOIN collections C on I.collection_id = C.id WHERE I.id =? AND C.owner_id = ?",
                [id, user_id],
                function (err, rows) {
                  if (err) {
                    connection.release();
                    callback(new Error("Error de acceso a la base de datos"));
                  } else if(rows.length == 0){ //El propietario no coincide
                    connection.release();
                    callback(null, false);
                  }else{
                    connection.query( //eliminación del elemento
                    "DELETE FROM collection_items WHERE id=?",
                    [id], (err) => {
                      connection.release();
                      if (err) return callback(err);
                      callback(null, rows);
                    });
                  }
                })
              }
            }
        );
      }
    });
  }
  filterByPublicItems(collection_id, user_id, callback){
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        //Se comprueba si existe la colección
        connection.query(
          "SELECT name, owner_id FROM collections WHERE  id=?",
          [collection_id],
          function (err, rows) {
            if (err) {
              connection.release();
              callback(new Error("Error de acceso a la base de datos"));
            } else if (rows.length > 0 && rows[0].owner_id!=user_id) { //La colección no es del usuario
              connection.query(
                "SELECT privat FROM collections WHERE id=?",
                [collection_id],
                function(err, row){
                  if(row[0].privat){ //Colección privada --> No se muestra ningún elemento
                    connection.release();
                    callback(null, false);
                  }else{ //Colección pública
                    connection.query(
                      "SELECT I.id, I.name, I.privat, I.description, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.collection_id = ? AND I.privat = 0 GROUP BY I.name ORDER BY I.name ASC",
                      [collection_id],
                      function (err, publicItemsRows) {
                        connection.release();
                        if (err) {
                          callback(new Error("Error de acceso a la base de datos"));
                        } else {
                          callback(null, publicItemsRows);
                        }
                      })
                  }
                })
            } else if(rows.length == 0) { //No existe la colección
              connection.release();
              callback(null, false);
            }else { //Colección del usuario
              connection.query(
                "SELECT I.id, I.name, I.privat, I.description, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.collection_id = ? AND I.privat = 0 GROUP BY I.name ORDER BY I.name ASC",
                [collection_id],
                function (err, itemsRows) {
                  connection.release();
                  if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                  } else {
                    callback(null, itemsRows);
                  }
                }
              );
            }
          }
        );
      }
    });
  }


  filterItemByName(user_id, name, collection_id, callback) {
    getPool().getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        //Se comprueba si existe la colección
        connection.query(
          "SELECT name, owner_id FROM collections WHERE  id=?",
          [collection_id],
          function (err, rows) {
            if (err) {
              connection.release();
              callback(new Error("Error de acceso a la base de datos"));
            } else if (rows.length > 0 && rows[0].owner_id!=user_id) { //La colección no es del usuario
              connection.query(
                "SELECT privat FROM collections WHERE id=?",
                [collection_id],
                function(err, row){
                  if(row[0].privat){ //Colección privada --> No se muestra ningún elemento
                    connection.release();
                    callback(null, false);
                  }else{ //Colección pública --> se muestran los elementos públicos
                    connection.query(
                      "SELECT I.id, I.name, I.privat, I.description, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.name LIKE CONCAT('%',?,'%') AND I.collection_id = ? AND I.privat = 0 GROUP BY I.name ORDER BY I.name ASC",
                      [name, collection_id],
                      function (err, publicItemsRows) {
                        connection.release();
                        if (err) {
                          callback(new Error("Error de acceso a la base de datos"));
                        } else {
                          callback(null, publicItemsRows, rows[0].owner_id);
                        }
                      })
                  }
                })
            } else if(rows.length == 0) { //No existe la colección
              connection.release();
              callback(null, false);
            }else { //Colección del usuario
              connection.query(
                "SELECT I.id, I.name, I.privat, I.description, GROUP_CONCAT(M.image) AS images FROM collection_items I LEFT JOIN collection_item_images M ON I.id =M.collection_item_id WHERE I.name LIKE CONCAT('%',?,'%') AND I.collection_id = ? GROUP BY I.name ORDER BY I.name ASC",
                [name, collection_id],
                function (err, itemsRows) {
                  connection.release();
                  if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                  } else {
                    callback(null, itemsRows,  rows[0].owner_id);
                  }
                }
              );
            }
          }
        );
      }
    });
  }

}
module.exports = collectionModel;
