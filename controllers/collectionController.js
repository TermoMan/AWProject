const collectionsModel = require("../models/collectionModel");
const nconf = require("nconf");
const path = require("path");
const fs = require("fs-extra");

const collectionModel = new collectionsModel();

/**
 *
 * @param {string} str
 */
const fullTrim = (str) =>
  str
    .trim()
    .split(" ")
    .filter((v) => !!v)
    .join(" ");

/**
 *
 * @param {string} name
 * @param {{ name: string; size: number; mimetype: string; }} image
 * @returns {string?} null if validation passes, otherwise it returns the error message.
 */
function validateCollection(name, image) {
  const _name = fullTrim(name);
  if (_name.length == 0) return "Nombre requerido";
  if (_name.length > 50) return "El nombre no puede superar los 50 caracteres";
  if (image) {
    if (image.size > 1024 * 1024) return "Imagen con tamaño superior a 1 MB";
    if (image.mimetype !== "image/jpeg")
      return "La imagen debe ser formato JPG/JPEG";
  }
  return null;
}

/**
 *
 * @param {string} name
 * @param {{ name: string; size: number; mimetype: string; }[]}
 * @returns {string?} null if validation passes, otherwise it returns the error message.
 */
function validateItem(name, images) {
  const _name = fullTrim(name);
  if (_name.length == 0) return "Nombre requerido";
  if (_name.length > 50) return "El nombre no puede superar los 50 caracteres";
  if (images && images.length) {
    if (!images.every((img) => img.size <= 1024 * 1024))
      return `Las imágenes no deben superar 1 MB de tamaño`;
    if (!images.every((img) => img.mimetype === "image/jpeg"))
      return "Las imágenes deben ser formato JPG/JPEG";
  }
  return null;
}

function deleteValidation(user_id, id, collections) {
  let owner_id = 1;
  if (user_id != owner_id) return "No tienes acceso a esta colección";
  if (!collections.find(n => n.id == id)) return "Colección no existente";
  return null;
}

module.exports = {
  createCollection(request, response, next) {
    response.render("createBasicCollection", { error: null });
  },
  validateCollection,
  insertCollection(request, response, next) {
    // Se obtienen los datos de la coleccion
    let name = request.body.name;
    let description = request.body.description || null;
    let privat = request.body.privat == "on" ? 1 : 0;
    let image;
    // Si el usuario ha subido una imagen
    const file = request.file;
    if (file) {
      image = {
        name: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
    }
    let error = validateCollection(name, image);
    if (error) {
      if (image) {
        fs.unlink(
          path.resolve(nconf.get("web:collection:image:path"), image.name),
          (err) => { if (err) console.error(err) }
        );
      }
      response.render("createBasicCollection", { error });
      return;
    }
    const filename = image ? image.name : null;
    collectionModel.insertCollection(
      response.locals.userId,
      name,
      description,
      filename,
      privat,
      function (err, result) {
        if (err) {
          if (image) {
            fs.unlink(
              path.resolve(nconf.get("web:collection:image:path"), image.name),
              (err) => { if (err) console.error(err) }
            );
          }
          next(err);
        } else if (!result) {
          if (image) {
            fs.unlink(
              path.resolve(nconf.get("web:collection:image:path"), image.name),
              (err) => { if (err) console.error(err) }
            );
          }
          response.render("createBasicCollection", {
            error: "ERROR: Ya existe una colección con ese nombre",
          });
        } else {
          response.redirect("/collections/");
        }
      }
    );
  },
  createCollectionItem(request, response, next) {
    collectionModel.checkCollection(
      request.params.idCollection,
      response.locals.userId,
      function (err, collection) {
        if (err) {
          next(err);
        } else if (!collection) {
          response.render("createBasicCollectionItem", {
            error: "error",
            collectionID: request.params.idCollection,
          });
        } else {
          response.render("createBasicCollectionItem", {
            error: null,
            collectionID: request.params.idCollection,
          });
        }
      }
    );
  },
  validateItem,
  /**
   *
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   */
  insertCollectionItem(request, response, next) {
    let collectionID = request.params.idCollection;
    let itemName = request.body.name;
    let itemDescription = request.body.description || null;
    let images;
    let privat = request.body.privat == "on" ? 1 : 0;
    if (request.files) {
      images = [];
      limit = false;
      /** @type {Express.Multer.File[]} */
      const files = request.files;
      images = files.map((file) => ({
        name: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      }));
    }
    let error = validateItem(itemName, images);
    if (error) {
      if (images) {
        images.forEach((img) => {
          fs.unlink(
            path.resolve(nconf.get("web:collection_item:image:path"), img.name),
            (err) => { if (err) console.error(err) }
          );
        });
      }
      response.render("createBasicCollectionItem", {
        error,
        collectionID: request.params.idCollection,
      });
      return;
    }

    collectionModel.insertCollectionItem(
      collectionID,
      itemName,
      itemDescription,
      images,
      privat,
      function (err, result) {
        if (err) {
          if (images) {
            images.forEach((img) => {
              fs.unlink(
                path.resolve(
                  nconf.get("web:collection_item:image:path"),
                  img.name
                ),
                (err) => { if (err) console.error(err) }
              );
            });
          }
          next(err);
        } else if (!result) {
          if (images) {
            images.forEach((img) => {
              fs.unlink(
                path.resolve(
                  nconf.get("web:collection_item:image:path"),
                  img.name
                ),
                (err) => { if (err) console.error(err) }
              );
            });
          }
          response.render("createBasicCollectionItem", {
            error: "ERROR: Ya existe un item de la colección con ese nombre",
            collectionID: request.params.idCollection,
          });
        } else {
          response.redirect(
            "/collections/" + request.params.idCollection
          );
        }
      }
    );
  },
  listUserCollections(request, response, next) {
    collectionModel.listUserCollections(response.locals.userId, function (err, list) {
      if (err) {
        next(err);
      } else {
        let collectionsList = new Array(); //Array en el que se guardarán las colecciones
        for (let element of list) {
          //Se obtienen de element los campos de la colección
          let collection = {
            id: element.id,
            name: element.name,
            description: element.description,
            image: element.image,
            privat: element.privat
          };
          //Sólo se muestran los 50 primeros caracteres de la descripción
          if (collection.description && collection.description.length > 50) {
            collection.description = collection.description.substr(0, 51) + " ...";
          }

          if (collection.image && collection.image.length == 0) {
            collection.image == null;
          }

          collectionsList.push(collection);
        }
        let exist = true;
        response.render("collectionsList", { collectionsList, exist });
      }
    });
  },

  deleteValidation,

  getImage(request, response, next) {
    const destination = path.resolve(nconf.get("web:collection:image:path"), request.params.image);
    if (!fs.existsSync(destination)) {
      next();
      return;
    }
    response.status(200);
    response.sendFile(destination);
  },

  deleteCollection(request, response, next) {

    let id = request.params.id; //Obtenemos el ID de la coleccion

    //Eliminamos imagen asociada a la coleccion
    collectionModel.getCollectionImage(id, function (err, result) {
      if (err) {
        next(err);
      } else if (result[0].image !== null) {
        fs.unlink(
          path.resolve(
            nconf.get("web:collection_item:image:path"),
            result[0].image
          ),
          (err) => { if (err) console.error(err) }
        );
      }
    });

    //Eliminamos imagenes asociadas a los elementos de la coleccion
    collectionModel.getCollectionItemsImages(id, function (err, result) {
      if (err) {
        next(err);
      } else if (result.length > 0) {
        result.forEach(img => {
          fs.unlink(
            path.resolve(
              nconf.get("web:collection_item:image:path"),
              img.image
            ),
            (err) => { if (err) console.error(err) }
          );
        });

      }
    });

    //Eliminamos la coleccion
    collectionModel.deleteCollection(response.locals.userId, id, function (err, result) {
      if (err) {
        next(err);
      } else if (!result) { // El usuario no es dueño de la coleccion 
        let collectionsList = [];
        let exist = false;
        response.render("collectionsList", { collectionsList, exist });
      } else {
        response.redirect("/collections/");
      }
    });
  },
  listCollectionItems(request, response, next) {
    let collectionId = request.params.collectionId; //Obtenemos el id de la colección
    let listCollectionItems = new Array();
    let userCollection;

    collectionModel.listCollectionItems(
      collectionId,
      response.locals.userId,
      function (err, list, owner, privat) {
        if (err) {
          next(err);
        } else if (!owner && privat) {
          userCollection = owner;
          response.render("listCollectionContents", {
            listCollectionItems: { listCollectionItems, userCollection, privat, collectionId },
          });
        } else { 
          let listCollectionItems = new Array();
          for (let element of list) {
            let itemImage = null;

            if (element.images) {
              //Si tiene imágenes se coge sólo la primera
              let images = element.images.split(","); //Array de imágenes
              itemImage = images[0];
            }

            let item = {
              //Campos que forman un elemento de la coleccion: Nombre, Desc e Imágenes
              id: element.id,
              name: element.name,
              description: element.description,
              image: itemImage,
              privat: element.privat,
            };

            if (item.description && item.description.length > 50) {
              //Sólo se muestran los 50 primeros caracteres
              item.description = item.description.substr(0, 51) + " ...";
            }

            listCollectionItems.push(item);
          }

          userCollection = owner;
          response.render("listCollectionContents", {
            listCollectionItems: { listCollectionItems, userCollection, collectionId, privat },
          });
        }
      }
    );
  },
  viewItemDetails(request, response, next) {
    let item_id = request.params.itemId;
    let item;
    collectionModel.viewItemDetails(item_id, response.locals.userId, function (err, itemrows) {
      if (err) {
        next(err);
      } else if (propiet || (!propiet && !colpriv && !itempriv)) {
        let userCollection = propiet;
        if (itemrows[0].name != null) {
          let im = new Array();
          if (itemrows[0].images) {
            im = itemrows[0].images.split(",");
          }
          if (itemrows[0].description == "") itemrows[0].description = null;
          let item = { name: itemrows[0].name, description: itemrows[0].description, privat: itemrows[0].privat,  images: im };
          response.render("viewItemDetails", { item: { item, userCollection } });
        }
      } else {
        let userCollection = propiet;
        response.render("viewItemDetails", { item: {userCollection, colpriv, itempriv } });
      }
    });
  },

  getItemImage(request, response, next) {
    const destination = path.resolve(nconf.get("web:collection_item:image:path"), request.params.image);
    if (!fs.existsSync(destination)) {
      next();
      return;
    }
    response.status(200);
    response.sendFile(destination);
  },
  getImage(request, response, next) {
    const destination = path.resolve(nconf.get("web:collection:image:path"), request.params.image);
    if (!fs.existsSync(destination)) {
      next();
      return;
    }
    response.status(200);
    response.sendFile(destination);
  },

  deleteItem(request, response, next) {
    let id = request.params.id; //Obtenemos el ID del elemento
    collectionModel.getItemImages(id, function (err, result) {
      if (err) {
        next(err);
      } else {
        collectionModel.deleteItem(response.locals.userId, id, function (err, res) {
          if (err) {
            next(err);
          } else if (!res) {
            let userCollection = false;
            let listCollectionItems = new Array();
            let collectionId = null;
            response.render("listCollectionContents", {
              listCollectionItems: { listCollectionItems, userCollection, collectionId },
            });
          } else {
            let images = result[0].images;
            let num = result[0].num;
            if (images != null) {
              if (num > 1) { //Hay más de 1 imagen
                let array = images.split(',');
                for (var i = 0; i < num; i++) {
                  fs.unlink(
                    path.resolve(
                      nconf.get("web:collection_item:image:path"),
                      array[i]
                    ),
                    (err) => { if (err) console.error(err) }
                  );
                }

              } else { // Hay 1 imagen
                fs.unlink(
                  path.resolve(
                    nconf.get("web:collection_item:image:path"),
                    images
                  ),
                  (err) => { if (err) console.error(err) }
                );
              }

            }
            response.redirect(
              "/collections/" + res[0].collection_id
            );
          }
        });
      }
    });
  },

  getItemName(request, response, next) {
   response.status(200);
   if(request.body.name){
    response.redirect("/collections/" + request.body.collectionId + "/name/" + request.body.name);
   }else{
     response.redirect("/collections/" + request.body.collectionId);
   }
  },

  filterItemsByName(request, response, next) {
    let listCollectionItems = new Array();
    let userCollection = false;
    let owner = false;

    let collectionId = request.params.collectionId;
    let itemName = request.params.itemName;

    collectionModel.filterItemByName(response.locals.userId, itemName, collectionId, function (err, list, ownerId) {
      if (err) {
        next(err);
      } else if (!list) {
        response.render("itemsFilteredByName", {
          listCollectionItems: { listCollectionItems, userCollection, collectionId, itemName, owner },
        });
      } else {
        for (let element of list) {
          let itemImage = null;

          if (element.images) {
            //Si tiene imágenes se coge sólo la primera
            let images = element.images.split(","); //Array de imágenes
            itemImage = images[0];
          }

          let item = {
            //Campos que forman un elemento de la coleccion: Nombre, Desc e Imágenes
            id: element.id,
            name: element.name,
            description: element.description,
            image: itemImage,
            privat: element.privat,
          };

          if (item.description && item.description.length > 50) {
            //Sólo se muestran los 50 primeros caracteres
            item.description = item.description.substr(0, 51) + " ...";
          }

          listCollectionItems.push(item);
        }

        if (ownerId== response.locals.userId){
          owner=true;
        }
      
        userCollection = true;
        response.render("itemsFilteredByName", {
          listCollectionItems: { listCollectionItems, userCollection, collectionId, itemName, owner },
        });
      }
    }
    );
  },

  filterByPublicItems(request, response, next) {
    let collectionId = request.params.collectionId; //Obtenemos el id de la colección
    let listCollectionItems = new Array();
    let userCollection = false;

    collectionModel.filterByPublicItems(
      collectionId,
      response.locals.userId,
      function (err, list) {
        if (err) {
          next(err);
        } else if (!list) { //No existe la colección o el usuario no es el dueño y la colección es privada
          response.render("listCollectionContents", {
            listCollectionItems: { listCollectionItems, userCollection, collectionId },
          });
        } else { //La colección es publica o el usuario es el dueño
          let listCollectionItems = new Array();
          for (let element of list) {
            let itemImage = null;

            if (element.images) {
              //Si tiene imágenes se coge sólo la primera
              let images = element.images.split(","); //Array de imágenes
              itemImage = images[0];
            }

            let item = {
              //Campos que forman un elemento de la coleccion: Nombre, Desc e Imágenes

              id: element.id,
              name: element.name,
              description: element.description,
              image: itemImage,
              privat: element.privat,
            };

            if (item.description && item.description.length > 50) {
              //Sólo se muestran los 50 primeros caracteres
              item.description = item.description.substr(0, 51) + " ...";
            }

            listCollectionItems.push(item);
          }

          userCollection = true;
          response.render("listCollectionContents", {
            listCollectionItems: { listCollectionItems, userCollection, collectionId },
          });
        }
      }
    );
  },
};
