var routes = require("express").Router();

// If you see a request to “/app” use whatever the “./loggedin” module exports.
routes.use("/", require("./loggedout"));
routes.use("/app", require("./loggedin"));
// app.use("/api", require("./api"));

// routes.get('/lost', function(req, res, next) {
//     res.render('loggedout/show-lostpassword', { data: 'My Data' });
// });


module.exports = routes;