module.exports = (req, res) => {
    req.logout();
    res.redirectWithMessage('/', {
        type: 'success',
        text: 'Bye bye'
    });
};