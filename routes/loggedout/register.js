// good example https://github.com/EranGrin/couchDB-Node-Passport-Login/blob/master/routes/users.js

const { db, createUser, createDB } = require('../../services/db');

module.exports = (req, res) => {

    const {
        username,
        password,
        confirm
    } = req.body;

    let errors = [];

    if (!username || !password || !confirm) {
        errors.push({
            msg: "Please enter all fields"
        });
    }

    if (password != confirm) {
        errors.push({
            msg: "Passwords do not match"
        });
    }

    if (password.length < 6) {
        errors.push({
            msg: "Password must be at least 6 characters"
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
            pasword: password
        }

        createUser(creds).then(function(resp) {
            createDB(creds.username).then(function() {
                res.redirect('/app');
            })
        }).catch(function(err) {
            console.log(err);
            errors.push({
                msg: err.message
            });
            res.render('loggedout/show-register', {
                errors,
                username,
                password,
                confirm
            });
        });
    };
}