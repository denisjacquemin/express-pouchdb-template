var express = require('express');
var router = express.Router();

// If you see a request to “/app” use whatever the “./loggedin” module exports.
module.exports = function(app) {
    app.use("/", require("./loggedout"));
    app.use("/app", require("./loggedin"));
    // app.use("/api", require("./api"));
}