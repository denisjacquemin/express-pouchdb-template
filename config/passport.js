const LocalStrategy = require('passport-local').Strategy;
const { usersDB } = require('../services/db');
const bcrypt = require('bcryptjs');


module.exports = function(passport) {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },

        function(username, password, done) {

            usersDB.find({
                selector: { _id: "org.couchdb.user:" + username },
                fields: ['password', '_id']
            })

            .then(function(user) {
                console.log(user);

                if (user.bookmark == 'nil') {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                bcrypt.compare(password, user.docs[0].password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })

            .catch(function(err) {
                return done(err);
            });

        }));

    passport.serializeUser(function(user, done) {
        done(null, user.docs[0]._id);
    });

    passport.deserializeUser(function(id, done) {
        db.find({
                selector: { _id: id },
                fields: ['password', '_id', 'name']
            })
            .then(user => {
                // console.log(user)
                // console.log(user.docs[0]._id)

                done(null, user); // :-)

            });
    });
}