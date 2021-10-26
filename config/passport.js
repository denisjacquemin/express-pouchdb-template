const LocalStrategy = require('passport-local').Strategy;
const { nano, usersDB, buildUserId } = require('../services/db');
const bcrypt = require('bcryptjs');

// Authenticate User (username/password), user should exist in _users database
// If authenticated return user object
module.exports = function(passport) {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },

        function(username, password, done) {

            // const db = nano.use('_users')
            // db.get('org.couchdb.user:jan')

            // .then((user) => {
            //         console.log(user)
            //     })
            //     .catch((err) => console.log(err));
            console.log('in login');
            debugger
            nano.auth(username, password)
                .then(() => nano.auth('admin', '123456'))
                .then(() => nano.use('_users').get(buildUserId(username)))
                .then((user) => done(null, user))
                .catch((err) => {
                    switch (err.error) {
                        case 'unauthorized':
                            return done(null, false, null);
                            break;
                        default:
                            return done(err);
                    }
                });



            // usersDB.find({
            //     selector: { name: username },
            //     fields: ["name", 'password', '_id']
            // })

            // .then(function(results) {

            //     if (results.bookmark == 'nil') {
            //         return done(null, false, { message: 'User' + username + ' is not registered' });
            //     }

            //     // Match password
            //     bcrypt.compare(password, results.docs[0].password, (err, isMatch) => {

            //         if (isMatch) {
            //             return done(null, results.docs[0]);
            //         } else {
            //             return done(null, false, { message: 'Password incorrect' });
            //         }
            //     });

            // })

            // .catch(function(err) {
            //     console.log(err);
            //     switch (err.error) {
            //         case 'unauthorized':
            //             return done(null, false, { message: 'Incorrect username password, try again or register.' });
            //             break;
            //         default:
            //             return done(err);
            //     }
            // });
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

        .then(function(results) {
            // console.log(user)
            // console.log(user.docs[0]._id)
            if (results.bookmark == 'nil') {
                return done('User not found', nil);
            }
            done(null, results.docs[0]); // :-)
        })

        .catch(function(err) {
            console.log(err);
        });
    });
}