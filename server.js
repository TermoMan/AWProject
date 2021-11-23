const nconf = require("nconf");
const app = require("./app");

if (app) {
  /** @type {number} */
  const port = process.env.PORT || nconf.get("server:port");

  app.listen(Number(port), function () {
    console.log("Servidor arrancado en el puerto " + port);
  });
}
