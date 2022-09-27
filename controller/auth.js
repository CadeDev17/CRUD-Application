const bcrypt = require('bcryptjs');

const User = require('../model/user')

exports.getLogin = (req, res, next) => {
  let errMessage = req.flash('error')
  if (errMessage.length > 0) {
    errMessage = errMessage[0]
  } else {
    errMessage = null
  }
  res.render('./auth/login.ejs', {
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: errMessage
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email: email })
    .then(user => {
      if (!user){
        req.flash('error', 'This email/password does not exist in our database')
        res.redirect('/login')
      }
      bcrypt
        .compare(password, user.password)
        .then(match => {
          if (match){
            console.log(user)
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
              console.log(err)
              res.redirect('/')
            })
          }
          req.flash('error', 'This email/password does not exist in our database')
          res.redirect('/login')
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

exports.getSignup = (req, res, next) => {
  let errMessage = req.flash('error')
  if (errMessage.length > 0) {
    errMessage = errMessage[0]
  } else {
    errMessage = null
  }
  res.render('./auth/signup.ejs', {
    pageTitle: 'Sign-up',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: errMessage
  })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        req.flash('error', 'This email already exists, try another one')
        res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPass => {
          const user = new User({ 
            email: email,
            password: hashedPass,
            cart: { items: [] }
          })
          return user.save()
        })
        .then(result => {
          res.redirect('/login')
        })
    })
    .catch(err => {
      console.log(err)
    })
}