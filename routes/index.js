var routes = require("express").Router();

routes.use(function(req, res, next) {
    console.log('in routes/index.js');
    var exists = req.i18n.exists('cookie')
    debugger;
    next();
});

// If you see a request to “/app” use whatever the “./loggedin” module exports.
routes.use("/", require("./loggedout"));
routes.use("/app", require("./loggedin"));
// app.use("/api", require("./api"));


module.exports = routes;