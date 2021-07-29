module.exports = (req, res) => {

    var scripts = [{ script: '/js/show-login.js' }];

    res.render('loggedout/show-login', { data: 'My Data', scripts: scripts });
};