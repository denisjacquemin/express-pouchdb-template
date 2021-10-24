var createError = require('http-errors');
var Handlebars = require('handlebars')
var i18next = require('i18next')
var i18nextMiddleware = require('i18next-http-middleware')
var i18nextBackend = require('i18next-fs-backend')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

i18next
    .use(i18nextBackend)
    .use(i18nextMiddleware.LanguageDetector).init({
        preload: ['en'],
        fallbackLng: 'en',
        backend: {
            // eslint-disable-next-line no-path-concat
            loadPath: __dirname + '/public/lang/{{lng}}/{{lng}}.json',
            // eslint-disable-next-line no-path-concat
            addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
        }
    })


var app = express();

app.use(
    i18nextMiddleware.handle(i18next, {
        // ignoreRoutes: ['/foo'] // or function(req, res, options, i18next) { /* return true to ignore */ }
    })
)

// see https://i18next.github.io/i18next/pages/doc_templates.html
Handlebars.registerHelper('t', function(i18n_key) {
    var result = i18n.t(i18n_key);

    return new Handlebars.SafeString(result);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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