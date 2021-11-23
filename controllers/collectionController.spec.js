const { test, expect, beforeEach, describe } = require("@jest/globals");
const fs = require("fs-extra");
const path = require("path");

const controller = require("./collectionController");

describe("Crear colección", () => {
  test("Nombre vacío", (done) => {
    const name = "";
    const error = controller.validateCollection(name);
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });

  test("Nombre con 49 caracteres", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisici";
    const error = controller.validateCollection(name);
    if (error) {
      done(error);
    } else {
      done();
    }
  });

  test("Nombre con 50 caracteres", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisicin";
    const error = controller.validateCollection(name);
    if (error) {
      done(error);
    } else {
      done();
    }
  });

  test("Nombre con más de 50 caracteres", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisicing elit.";
    const error = controller.validateCollection(name);
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });

  test("Imagen tamaño mayor de 1 MB", (done) => {
    const name = "MiColeccion";
    const error = controller.validateCollection(name, {
      name: "mocoleccion.jpg",
      size: 1024 * 1025,
      mimetype: "image/jpeg",
    });
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });

  test("Imagen tamaño menor que 1 MB", (done) => {
    const name = "MiColeccion";
    const error = controller.validateCollection(name, {
      name: "collection.jpg",
      size: 1000 * 1000,
      mimetype: "image/jpeg",
    });

    if (error) {
      done(error);
    } else {
      done();
    }
  });

  test("Imagen tamaño igual que 1 MB", (done) => {
    const name = "MiColeccion";
    const error = controller.validateCollection(name, {
      name: "myCollection.jpg",
      size: 1024 * 1024,
      mimetype: "image/jpeg",
    });

    if (error) {
      done(error);
    } else {
      done();
    }
  });
});

describe("Crear elemento de colección", () => {
  test("Nombre vacío", (done) => {
    const name = "";
    const error = controller.validateItem(name);
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });

  test("Nombre con 49 caracteres", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisici";
    const error = controller.validateItem(name);
    if (error) {
      done(error);
    } else {
      done();
    }
  });

  test("Nombre con 50 caracteres", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisicin";
    const error = controller.validateItem(name);
    if (error) {
      done(error);
    } else {
      done();
    }
  });

  test("Nombre con más de 50 caracteres", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisicing elit.";
    const error = controller.validateItem(name, [
      {
        name: "",
        size: 0,
        mimetype: "image/jpeg",
      },
    ]);
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });
});

let collections = [
  {
    id: 1,
    owner_id: 1,
    name: "collection1",
    image: "image.jpg"
  },
  {
    id: 2, 
    owner_id: 1, 
    name: "collection2",
  }
];

describe("Eliminar colección", () => {
  test("Dueño de la colección", (done) => {
    const error = controller.deleteValidation(1, 1, collections);
    if (error) {
      done(error);
    } else {
      done();
    }
   });

  test("Usuario que no es el dueño", (done) => {
    const error = controller.deleteValidation(2, 1, collections);
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });

  test("Colección existente", (done) => { 
    const error = controller.deleteValidation(1, 2, collections);
    if (error) {
      done(error);
    } else {
      done();
    }
  });

  test("Colección no existente", (done) => {
    const error = controller.deleteValidation(1, 3, collections);
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });
});