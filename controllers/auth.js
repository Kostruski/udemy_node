const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = async (req, res, next) => {
    const user = await User.findById('5bab316ce0a7c75f783cb8a8');
    req.session.user = user;
    req.session.isLoggedIn = true;
    res.redirect('/');
};
