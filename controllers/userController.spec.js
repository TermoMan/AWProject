const { test, expect, beforeEach, describe } = require("@jest/globals");
const fs = require("fs-extra");
const path = require("path");

const controller = require("./userController");
describe("Registrar cuenta", () => {
  test("Nombre vacío", (done) => {
    const name = "";
    const error = controller.validateUser(name);
    if (error) {
      done();
    } else {
      done(new Error());
    }
  });

  test("Nombre no vacío", (done) => {
    const name = "Usuario1234";
    const email = "email@gmail.com";
    const error = controller.validateUser(name, email);
    if (error) {
      done(error);
    } else {
      done();
    }
  });

  test("Email vacío", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisici";
    const email = "";
    const error = controller.validateUser(name, email);
    if (error) {
        done();
    } else {
        done(new Error());
    }
  });

  test("Email no vacío", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisici";
    const email = "email@gmail.com";
    const error = controller.validateUser(name, email);
    if (error) {
        done(error);
    } else {
        done();
    }
  });

  test("Contraseñas diferentes", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisicin";
    const email = "email@gmail.com"
    const pass1 = "1Contraseña.especial";
    const pass2 = "2Contraseña.especial";
    const error = controller.validateUser(name, email, pass1, pass2);
    if (error) {
        done();
    } else {
        done(new Error());
    }
  });

  test("Contraseñas iguales", (done) => {
    const name = "Lorem ipsum dolor sit amet consectetur, adipisicin";
    const email = "email@gmail.com"
    const pass1 = "1Contraseña.especial";
    const pass2 = "1Contraseña.especial";
    const error = controller.validateUser(name, email, pass1, pass2);
    if (error) {
        done(error);
    } else {
        done();
    }
  });

  test("Imagen tamaño mayor de 1 MB", (done) => {
    const name = "MiUsuario";
    const email = "email@gmail.com"
    const pass1 = "1Contraseña.especial";
    const pass2 = "1Contraseña.especial";
    const error = controller.validateUser(name, email, pass1, pass2, {
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
    const name = "MiUsuario";
    const email = "email@gmail.com"
    const pass1 = "1Contraseña.especial";
    const pass2 = "1Contraseña.especial";
    const error = controller.validateUser(name, email, pass1, pass2, {
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
    const name = "MiUsuario";
    const email = "email@gmail.com"
    const pass1 = "1Contraseña.especial";
    const pass2 = "1Contraseña.especial";
    const error = controller.validateUser(name, email, pass1, pass2, {
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
