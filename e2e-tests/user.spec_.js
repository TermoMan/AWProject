const { test, afterEach, beforeEach } = require("@jest/globals");
const session = require('supertest-session');
const supertest = require("supertest");
const app = require("../app");
const database = require("../database");
const fs = require("fs-extra");
const path = require("path");
const nconf = require("nconf");
const async = require("async");

/** @type {import("http").Server} */
let server;
/** @type {import("supertest").SuperAgentTest} */
let request;

let testSession = null;
let authenticatedSession;

beforeEach((done) => {
  server = app.listen(3002, done);
  request = supertest.agent(server);
  testSession = session(app);
    testSession
      .post("/users/login")
      .send({
        user: "test",
        password: "test",
      })
      .end(function(err,res){
        if (err) {
          return done(err);
        }
        expect(302);
        authenticatedSession=testSession;
        return done();      
      });
});

afterEach((done) => {
  async.parallel(
    [(cb) => database.closePool(cb), (cb) => server.close(cb)],
    (err) => done(err)
  );
  
});

describe("Iniciar sesión" , () => {
   test("Iniciar sesión con datos correctos", (done) => {
        testSession
          .post("/users/login")
          .send({
            user: "test",
            password: "test",
          })
         .end(function(err,res){
            if (err) {
              return done(err);
            }
            expect(302);
            return done();      
          });
      });

    test("Iniciar sesión con datos incorrectos", (done) => {
        testSession
          .post("/users/login")
          .send({
            user: "test",
            password: "1234",
          })
          .end(function(err,res){
            if (err) {
              return done(err);
            }
            expect(200);
            return done();      
          });
      });
});

test("Cerrar sesión", (done) => {
  authenticatedSession
      .get("/users/logout")
      .expect(302)
      .then((res) => done())
      .catch((err) => done(err));
});

/*
test("Registrar cuenta", (done) => {
  done();
  if (!fs.existsSync(path.resolve("e2e-tests/files/imagen.jpg"))) {
    return done("imagen.jpg not found");
  }
  request
    .post("/users/register")
    .field({
      name: "PruebaUsuario",
      email: "usuarioprueba@email.com",
      password1: "1Contraseña.especial",
      password2: "1Contraseña.especial",
    })
    .attach(
      "filename",
      fs.readFileSync(path.resolve("e2e-tests/files/imagen.jpg"))
    )
    .then(() => done())
    .catch((err) => done(err));
  });
   */