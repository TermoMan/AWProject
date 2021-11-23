"use strict";

const fs = require("fs-extra");
const dotenv = require("dotenv");
const nconf = require("nconf");
const express = require("express");
const path = require("path");

const session = require("express-session");
const mysqlSession = require("express-mysql-session");

function getApp() {
  const env = (process.env.NODE_ENV || "dev").trim();

  if (env !== "prod") {
    const envConfigPath = path.resolve(`env/${env}.env`);
    if (!fs.existsSync(envConfigPath)) {
      console.error("env config file not found");
      return;
    }

    const dotenvResult = dotenv.config({ path: envConfigPath });

    if (!dotenvResult) {
      console.error("error loading env config file");
      return;
    }
  }

  const nconfConfigPath = path.resolve(`nconf/${env}.json`);

  if (!fs.existsSync(nconfConfigPath)) {
    console.error("nconf config file not found");
    return;
  }

  nconf.file({ file: nconfConfigPath });

  // Crear un servidor Express.js
  const app = express();

  // Configuración express
  app.set("view engine", "ejs");
  app.set("views", path.resolve("views"));

  // Serve Public
  app.use(express.static(path.resolve("public")));

  const MySQLStore = mysqlSession(session);

  //Instancia MySQLStore
  const sessionStore = new MySQLStore({
    host: nconf.get("database:host"),
    port: nconf.get("database:port"),
    user: nconf.get("database:user"),
    password: process.env.DATABASE_PWD,
    database: nconf.get("database:database"),
  });

  if (env != "test") {
    const middlewareSession = session({
      saveUninitialized: false,
      secret: "foobar34",
      resave: false,
      store: sessionStore,
    });
  
    app.use(middlewareSession);
  }
  

  app.get("/", function (request, response, next) {
    if (request.session.email) {
      response.locals.email = request.session.email;
      response.locals.name = request.session.name;
      response.locals.password =  request.session.password;
      response.locals.userId = request.session.userId;
      response.locals.image = request.session.image;

      response.redirect("/collections");
    } else {
      response.redirect("/users/login");
    }
  });

  app.use(express.urlencoded({ extended: true }));
  
  const routerCollection = require("./routers/collectionRouter");

  app.use("/collections", routerCollection);
  // Rutas
  // Errores

  const routerUser = require("./routers/userRouter");

  app.use("/users", routerUser);

  app.use(function (request, response, next) {
    response.status(404);
    response.render("error", { status: 404, message: "Página no encontrada" });
  });

  app.use(function (error, request, response, next) {
    if(env != 'test') console.error(error);
    response.status(500);
    response.render("error", {
      status: 500,
      message: "Error interno del servidor",
    });
  });

  return app;
}
module.exports = getApp();
