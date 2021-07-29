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
            failureFlash: true
        })(req, res, next)

        // db.signIn(creds).then(function(resp) {
        //     res.redirect('/app');
        // }).catch(function(err) {
        //     console.log(err);
        //     errors.push({
        //         msg: err.message
        //     });
        //     res.render('loggedout/show-register', {
        //         errors,
        //         username,
        //         password,
        //         confirm
        //     });
        // });
    }

};