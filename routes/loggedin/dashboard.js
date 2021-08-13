module.exports = (req, res) => {

    // const errors = req.flash('error');
    // const infos = req.flash('success');
    console.log('4');

    const data = {
        user: req.user
    }
    res.renderWithMessage('loggedin/dashboard', { data: data }, { type: 'success', text: 'Hello There3' })
};