module.exports = (req, res) => {
    console.log('In Show-login routes');


    var scripts = [{ script: '/js/show-login.js' }];

    // data = {
    //     sessionFlash: res.locals.sessionFlash
    // }

    res.render('loggedout/show-login', {});
};