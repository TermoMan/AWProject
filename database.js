const mysql = require("mysql");
const nconf = require("nconf");

/** @type {import("mysql").Pool} */
let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: nconf.get("database:host"),
      port: nconf.get("database:port"),
      database: nconf.get("database:database"),
      user: nconf.get("database:user"),
      password: process.env.DATABASE_PWD,
    });
  }
  return pool; 
}

/**
 * @returns {Promise<Connection>}
 */
function getConnection() {
  return new Promise((resolve, reject) =>{
    getPool().getConnection((err, conn) => {
      if (err) reject(err);
      else resolve(new Connection(conn));
    });
  });
  
}

/**
 *
 * @param {(err?: Error) => void} callback
 */
function closePool(callback) {
  if (pool) {
    pool.end((err) => {
      pool = null;
      callback(err);
    });
  }
}

class Connection {
  /** @type {import("mysql").PoolConnection} */
  conn;
  constructor(conn) {
    this.conn = conn;
  }

  release() {
    this.conn.release();
  }
/**
 * 
 * @param {string} sql 
 * @param {any[]} [values] 
 * @returns {Promise<any[]>}
 */
  query(sql, values) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(values)) {
        this.conn.query(sql, values, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      } else {
        this.conn.query(sql, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }
    });
  }
/**
 * @returns {Promise<void>}
 */
  begin() {
    return new Promise((resolve, reject) => {
      this.conn.beginTransaction((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
/**
 * @returns {Promise<void>}
 */
  commit() {
    return new Promise((resolve, reject) => {
      this.conn.commit((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
/**
 * @returns {Promise<void>}
 */
  rollback() {
    return new Promise((resolve, reject) => {
      this.conn.rollback((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

async function example() {
  let conn;
  try {
    conn = await getConnection();
    const sql = `
    SELECT foo.*, bar.* FROM foo
    LEFT JOIN bar ON foo.id = bar.foo_id
    WHERE foo.id = ?`;
    const rows = await conn.query(sql, [1]);
    if (rows.length == 0) return null;
    const r = {
      id: rows[0].id,
      // ...
      images: rows.map((r) => r.image)
    };
    return r;
  } catch (ex) {
    throw new Error(ex.message); // Capturamos y lanzamos nueva excepción para que el mensaje de error indique esta linea
  } finally {
    if (conn) conn.release();
  }
}

async function exampleList() {
  let conn;
  try {
    conn = await getConnection();
    const sql = `
    SELECT foo.*, bar.* FROM foo
    LEFT JOIN bar ON foo.id = bar.foo_id`;
    const rows = await conn.query(sql, [1]);
    if (rows.length == 0) return rows;
    const foos = Object.values(_.groupBy(rows, (r) => r.id));
    return foos.map((r) => ({
      id: r[0].id,
      // ...
      images: r.map((r) => r.image)
    }));
  } catch (ex) {
    throw new Error(ex.message); // Capturamos y lanzamos nueva excepción para que el mensaje de error indique esta linea
  } finally {
    if (conn) conn.release();
  }
}


async function exampleTransaction() {
  let conn;
  try {
    conn = await getConnection();
    await conn.begin();
    const sql = `
    INSERT INTO foo (name)
    VALUES (?)`;
    await conn.query(sql, ["name"]);
    await conn.commit();
  } catch (ex) {
    try {
      if (conn) await conn.rollback(); // Si no hay transaccion abierta dará error y lo ignoramos
    } catch (ex) {}
    throw new Error(ex.message); // Capturamos y lanzamos nueva excepción para que el mensaje de error indique esta linea
  } finally {
    if (conn) conn.release();
  }
}
module.exports = {
  getPool,
  closePool,
  getConnection,
};
