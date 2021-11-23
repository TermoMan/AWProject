const { test, afterEach, beforeEach } = require("@jest/globals");
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

beforeEach((done) => {
  server = app.listen(3001, done);
  request = supertest.agent(server);
});

afterEach((done) => {
  async.parallel([
    (cb) => server.close(cb),
    (cb) => database.closePool(cb),
  ], (err) => done(err));
});

/* afterAll((done) => {
  async.parallel(
    [(cb) => database.closePool(cb), (cb) => {if(server) server.close(cb)}],
    (err) => done(err)
  );
}); */

test("Crear colección pública", (done) => {
  if (!fs.existsSync(path.resolve("e2e-tests/files/imagen.jpg"))) {
    return done("imagen.jpg not found");
  }
  request
    .post("/collections/create")
    .attach("filename", path.resolve("e2e-tests/files/imagen.jpg"))
    .field({
      name: "PruebaCollection",
      decription: "Esto es una prueba",
      privat: 0,
    })
    .then((res) => {
      done();
    })
    .catch(done);
});

test("Crear colección privada", (done) => {
  if (!fs.existsSync(path.resolve("e2e-tests/files/imagen.jpg"))) {
    return done("imagen.jpg not found");
  }
  request
    .post("/collections/create")
    .attach("filename", path.resolve("e2e-tests/files/imagen.jpg"))
    .field({
      name: "PruebaCollectionPrivada",
      decription: "Esto es una prueba de una coleccion privada",
      privat: 1,
    })
    .end(done);
});

test("Crear elemento de colección", (done) => {
  if (!fs.existsSync(path.resolve("e2e-tests/files/imagen.jpg"))) {
    return done("imagen.jpg not found");
  }
  request
    .post("/collections/1/create")
    .attach("filename", path.resolve("e2e-tests/files/imagen.jpg"))
    .field({
      name: "PruebaCollectionPublicItem",
      decription: "Esto es una prueba de creación de un elemento público",
      privat: 0,
    })
    .then((res) => {
      done();
    })
    .catch(done);
});

test("Crear elemento privado de colección", (done) => {
  if (!fs.existsSync(path.resolve("e2e-tests/files/imagen.jpg"))) {
    return done("imagen.jpg not found");
  }
  request
    .post("/collections/1/create")
    .attach("filename", path.resolve("e2e-tests/files/imagen.jpg"))
    .field({
      name: "PruebaCollectionPrivateItem",
      decription: "Esto es una prueba de creación de un elemento privado",
      privat: 1,
    })
    .end(done);
});

test("Listar elementos de una coleccion", (done) => {
  request
    .get("/collections/1")
    .send()
    .end(done);
});

test("Ver detalles de un elemento", (done) => {
  request
    .get("/collections/viewItem/1")
    .end(done);
});
test("Listar colecciones", (done) => {
  request
    .get("/collections")
    .end(done);
});

test("Buscar elementos por nombre", (done) => {
  testSession
    .get("/collections/1/name/test")
    .send()
    .then((res) => {
      done();
    })
    .catch((err) => done(err));
});

test("Listar elementos públicos de una colección", (done) => {
  testSession
    .get("/collections/1/public")
    .send()
    .then((res) => {
      done();
    })
    .catch((err) => done(err));
});
