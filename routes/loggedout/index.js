const LoggedOutRouter = require("express").Router();

LoggedOutRouter.route('/')
    .get(require("./show-login.js"))
    .post(require("./login.js"));

LoggedOutRouter.route('/register')
    .get(require("./show-register.js"))
    .post(require("./register.js"));

LoggedOutRouter.route('/lostpassword')
    .get(require("./show-lostpassword.js"))
    .post(require("./lostpassword.js"));

module.exports = LoggedOutRouter;