const User = require('../model/user')

exports.getLogin = (req, res, next) => {
    res.render('./auth/login.ejs', {
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('632c68ad52b7eea368301a57')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

// exports.getSignup = (req, res, next) => {
//     let message = req.flash('error')
//     res.render('./auth/signup.ejs', {
//         pageTitle: 'Sign-Up',
//         errMessage: message,
//         validationErrors: []
//     })
// }