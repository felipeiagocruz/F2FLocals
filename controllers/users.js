const User = require('../models/user');

module.exports.renderRegistro = (req, res) => {
    res.render('users/register')
}

module.exports.registrarUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('sucess', 'Bem vindo a f2flocals!')
            res.redirect('/f2flocal/');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }

}

module.exports.loginUser = (req, res) => {
    res.render('users/login')
}

module.exports.passportLogin = (req, res) => {
    req.flash('sucess', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/f2flocal';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    res.redirect('/f2flocal/')
}