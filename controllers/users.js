const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // login after register an account
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Tenplay!');
            res.redirect('/tenniscourts');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    // const redirectUrl = req.session.returnTo || '/tenniscourts';
    const redirectUrl = '/tenniscourts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/tenniscourts');
}

module.exports.renderUser = async(req, res) => {
    const { id } = req.params;
    console.log(id)
    const user = await User.findById(id).populate('bookings').populate({
        path: 'bookings',
        populate: {
            path: 'ground'
        }
    });
    console.log(user)
    res.render('users/user', { user });
}
