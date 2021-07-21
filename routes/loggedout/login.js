var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    // if success redirect to dashboard
    // ortherwise display an error message on show-login

    res.render('loggedout/login', { data: 'My Data' });
});

module.exports = router;