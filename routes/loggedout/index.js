const LoggedOutRoutes = require("express").Router();

LoggedOutRoutes
    .route('/')
    .get(require("./show-login.js"))
    .post(require("./login.js"));

LoggedOutRoutes
    .route('/register')
    .get(require("./show-register.js"))
    .post(require("./register.js"));

LoggedOutRoutes
    .route('/lostpassword')
    .get(require("./show-lostpassword.js"))
    .post(require("./lostpassword.js"));

module.exports = LoggedOutRoutes;