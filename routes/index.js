var routes = require("express").Router();

// If you see a request to “/app” use whatever the “./loggedin” module exports.
routes.use("/", require("./loggedout"));
routes.use("/app", require("./loggedin"));
// app.use("/api", require("./api"));


module.exports = routes;