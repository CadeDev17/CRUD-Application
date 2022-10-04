const crypto = require('crypto')

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')

const User = require('../model/user');
const user = require('../model/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: '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'
    }
  })
)

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
          console.log(email)
          return transporter.sendMail({
            to: email,
            from: 'decryptr22@gmail.com',
            subject: 'Thank you for joining the devSwag() community!',
            html:'<h1>Welcome to devSwag()!</h1>'
          })
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

exports.getReset = (req, res, next) => {
  let errMessage = req.flash('error')
  if (errMessage.length > 0) {
    errMessage = errMessage[0]
  } else {
    errMessage = null
  }
  res.render('./auth/reset.ejs', {
    pageTitle: 'Reset Password',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: errMessage
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const tokenId = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user){
          req.flash('error', 'This email does not exist in our database')
          return res.redirect('/reset')
        }
        user.resetTokenId = tokenId;
        user.resetTokenIdExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/')
        transporter.sendMail({
          to: req.body.email,
          from: 'decryptr22@gmail.com',
          subject: 'Password Reset',
          html:`<p>Click this <a href="http://localhost:3000/reset/${tokenId}">link</a> to set a new password.</p>`
        })
      })
      .catch(err => {
        console.log(err)
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const tokenId = req.params.tokenId
  User.findOne({ resetTokenId: tokenId, resetTokenIdExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('./auth/new-password.ejs', {
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        isAuthenticated: req.session.isLoggedIn,
        passwordToken: tokenId
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.postNewPassword = (req, res, next) => {
  const newPass = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetedUser

  User.findOne({ 
    resetToken: passwordToken, 
    resetTokenIdExpiration: { $gt: Date.now() }, 
    _id: userId 
  })
    .then(user => {
      resetedUser = user
      return bcrypt.hash(newPass, 12)
    })
    .then(hashedPass => {
      resetedUser.password = hashedPass;
      resetedUser.resetToken = undefined;
      resetedUser.resetTokenExpiration = undefined;
      return resetedUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
}