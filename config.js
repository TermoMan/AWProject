"use strict";

const mysql = require("mysql");

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      port: "3306",
      database: "404db",
      user: "root",
      password: "",
    });
  }
  return pool; 
}

module.exports = getPool