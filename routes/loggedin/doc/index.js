const DocRouter = require("express").Router();

DocRouter.route('/new')
    .get(require("./new.js"));
DocRouter.route('/edit')
    .post(require("./edit.js"));

module.exports = DocRouter;