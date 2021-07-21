const LoggedInRouter = require("express").Router();

LoggedInRouter.use('/', require("./dashboard.js"));
LoggedInRouter.use('/logount', require("./logout.js"));
LoggedInRouter.use('/account', require("./account.js"));
LoggedInRouter.use('/parameters', require("./parameters.js"));
LoggedInRouter.use('/doc', require("./doc"));

module.exports = LoggedInRouter;