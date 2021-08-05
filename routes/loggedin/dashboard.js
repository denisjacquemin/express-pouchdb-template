module.exports = (req, res) => {

    // const errors = req.flash('error');
    // const infos = req.flash('success');

    res.render('loggedin/dashboard', { data: 'My Data' });
};