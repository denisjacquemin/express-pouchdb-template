module.exports = (req, res) => {

    res.render('loggedout/show-register', { sessionFlash: res.locals.sessionFlash });
};