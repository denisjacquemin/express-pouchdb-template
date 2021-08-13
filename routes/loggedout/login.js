const db = require('../../services/db');
const passport = require("passport");


module.exports = (req, res, next) => {
    console.log('3');

    const creds = {
        username,
        password
    } = req.body;

    if (!creds.username || !creds.password) {

        data = {
            username: creds.username,
            password: creds.password
        }
        return res.renderWithMessage('loggedout/show-login', { data: data }, { type: 'error', text: 'Please enter all fields' })
    }

    passport.authenticate('local', {
        session: true,
        successRedirect: '/app',
        failureFlash: 'Invalid username or password.',
        failureRedirect: '/',
        successFlash: 'Welcome!'
    })(req, res, next);

};
// function(err, user, info, status) {
//     if (err) {
//         // message
//         data = {
//             sessionFlash: { type: 'error', message: err },
//             username: creds.username,
//             password: creds.password
//         }
//         return res.render('loggedout/show-login', { data: data });
//     }
//     if (!user) {
//         data = {
//             sessionFlash: { type: 'error', message: 'Auth incorrect' },
//             username: creds.username,
//             password: creds.password
//         }
//         return res.render('loggedout/show-login', { data: data });
//     }
//     req.login(user, function(err) {
//         if (err) {
//             data = {
//                 sessionFlash: { type: 'error', message: err },
//                 username: creds.username,
//                 password: creds.password
//             }
//             return res.render('loggedout/show-login', { data: data });
//         }
//         req.session.sessionFlash = { type: 'success', message: 'Welcome!!!' }

//         res.redirect('/app');
//     });

// })(req, res, next)