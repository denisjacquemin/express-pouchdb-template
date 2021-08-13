const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');

const app = express();

// Passport Config
require('./config/passport')(passport);

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(cookieParser('secret'));
app.use(session({
    name: 'q74dh74uihdj39',
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

// https://gist.github.com/brianmacarthur/a4e3e0093d368aa8e423
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
// add your middleware after the express.static middleware to run middleware on all express routes except for static assets

app.use(function(req, res, next) {

    res.redirectWithMessage = function(url, message) {
        console.log('in redirectWithMessage');
        req.session.messages = req.session.messages || []
        req.session.messages.push(message);
        res.redirect(url);
    }

    res.renderWithMessage = function(template, data = {}, message) {
        console.log('in renderWithMessage');
        res.locals.messages = res.locals.messages || []
        res.locals.messages.push(message);
        res.render(template, data);
    }

    // So processing can continue
    next()
})
app.use(function(req, res, next) {
    console.log('2');
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.messages = req.session.messages || [];
    if (typeof req.session.flash !== "undefined") {
        if (typeof req.session.flash.error !== "undefined") {
            res.locals.messages = res.locals.messages.concat(req.session.flash.error.map(msg => {
                return { type: 'error', text: msg }
            }))
        }
        if (typeof req.session.flash.success !== "undefined") {
            res.locals.messages = res.locals.messages.concat(req.session.flash.success.map(msg => {
                return { type: 'success', text: msg }
            }))
        }
    }

    // var c = [...a||[], ...b||[]]
    delete req.session.flash;
    delete req.session.messages;
    next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// app.use(function(req, res, next) {
//     // before every route, attach the flash messages and current user to res.locals
//     res.locals.alerts = req.flash();
//     // res.locals.currentUser = req.user;
//     next();
// });

app.use('/', require('./routes'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;