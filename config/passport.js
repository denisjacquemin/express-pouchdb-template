const LocalStrategy = require('passport-local').Strategy;
const { nano, usersDB } = require('../services/db');
const bcrypt = require('bcryptjs');


module.exports = function(passport) {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },

        function(username, password, done) {

            usersDB.find({
                selector: { name: username },
                fields: ["name", 'password', '_id']
            })

            .then(function(user) {
                console.log(user);

                if (user.bookmark == 'nil') {
                    return done(null, false, { message: 'User' + username + ' is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.docs[0].password, (err, isMatch) => {

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });

            })

            .catch(function(err) {
                console.log(err);
                switch (err.error) {
                    case 'unauthorized':
                        return done(null, false, { message: 'Incorrect username password, try again or register.' });
                        break;
                    default:
                        return done(err);
                }
            });
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user.name);
    });

    passport.deserializeUser(function(name, done) {
        nano.db.use('_users').find({
            selector: { name: name },
            fields: ['name', 'roles']
        })

        .then(function(result) {
            // console.log(user)
            // console.log(user.docs[0]._id)
            if (result.bookmark == 'nil') {
                return done('User not found', nil);
            }
            done(null, result.docs[0]); // :-)
        })

        .catch(function(err) {
            console.log(err);
        });
    });
}