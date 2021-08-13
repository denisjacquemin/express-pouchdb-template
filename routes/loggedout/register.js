// good example https://github.com/EranGrin/couchDB-Node-Passport-Login/blob/master/routes/users.js

const { db, usersDB, createUser, createDB, addDBPermissions, linkUserToDB } = require('../../services/db');

module.exports = (req, res) => {

    const {
        username,
        password,
        confirm
    } = req.body;

    try {
        if (!username || !password || !confirm) {
            throw new Error('Please enter all fields');
        }

        if (password != confirm) {
            throw new Error('Passwords do not match');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
    } catch (err) {
        data = {
            username: username,
            password: password,
            confirm: confirm,
        }

        return res.renderWithMessage('loggedout/show-register', data, { type: 'error', text: err.message });
    }


    createUser({
        username: username,
        password: password
    })

    .then((user) => createDB(user))

    .then((data) => addDBPermissions(data.dbname, data.user, admins = {
            names: [],
            roles: []
        },
        members = {
            names: [data.user.name],
            roles: []
        }
    ))

    .then((data) => linkUserToDB(data.user, data.dbname))

    .then((data) => {
        req.login(data.user, function(err) {
            if (err) { throw new Error(err); }

            return res.redirectWithMessage('/app', { type: 'success', text: 'Welcome from register!!' })
        });
    })

    // .catch(function(err) {
    //     throw new Error(err);
    // })
    .catch(function(err) {

        data = {
            username: username,
            password: password,
            confirm: confirm,
        }

        return res.renderWithMessage('loggedout/show-register', data, {
            type: 'error',
            text: err.message
        });
    });

}