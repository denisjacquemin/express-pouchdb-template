const db = require('../../services/db');
const passport = require("passport");


module.exports = (req, res, next) => {

    const {
        username,
        password
    } = req.body;

    let errors = [];

    if (!username || !password) {
        errors.push({
            msg: "Please enter all fields"
        });
    }

    if (errors.length > 0) {
        res.render('loggedout/show-register', {
            errors,
            username,
            password,
            confirm
        });
    } else {
        const creds = {
            username: username,
            password: password
        }

        passport.authenticate('local', {
            successRedirect: '/app',
            failureRedirect: '/',
            successFlash: 'Welcome!',
            failureFlash: true //Setting the failureFlash option to true instructs Passport to flash an error message using the message given by the strategy's verify callback, if any
        })(req, res, next)
    }

};