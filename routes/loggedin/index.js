const LoggedInRouter = require("express").Router();

// LoggedInRouter.all('*', requireAuthentication, loadUser);

LoggedInRouter.route('/')
    .get(require("./dashboard.js"));
LoggedInRouter.route('/logout')
    .post(require("./logout.js"));
LoggedInRouter.route('/account')
    .get(require("./account.js"));
LoggedInRouter.route('/parameters')
    .get(require("./parameters.js"));
LoggedInRouter.use("/doc", require("./doc"));

module.exports = LoggedInRouter;

function requireAuthentication() {
    console.log('### in requireAuthentication ###');
    next();
}

function loadUser() {
    console.log('### in loadUser ###');
    next();
}