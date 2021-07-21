const DocRouter = require("express").Router();

DocRouter.get('/new', require("./new.js"));
DocRouter.post('/edit', require("./edit.js"));

module.exports = DocRouter;