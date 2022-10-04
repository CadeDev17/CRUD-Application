// ToDo pt.1:
// - Add ability to send email to new users using sendgrid √
// - Send emails with nodemailer √
// - Create reset password option √
// - Update password in DB after user resets √
// - Add authorization for product editing/adding so that one user cannot see/edit another users created products √
// - Re-write above steps from scratch

// ToDo pt.2:
// - Install and use express-validator
// - Add input validation to signup page 
// - Add input validation to login page
// - Add input validation to the add/edit products pages

const express = require('express') 
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const User = require('./model/user')

const homeRoute = require('./routes/home')
const productRoute = require('./routes/shop')
const adminRoute = require('./routes/admin')
const authRoute = require('./routes/auth')

const MONGODB_URI =
  'mongodb+srv://Decryptr:Yko35961!@cluster0.rg76ghz.mongodb.net/shop'
    // 'mongodb://127.0.0.1:27017/shop';

    // mongodb+srv://Decryptr:Yko35961!@cluster0.rg76ghz.mongodb.net/shop

const app = express() 
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views') 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session(
  {
    secret: 'superduperlongsecret',
    resave: false,
    saveUninitialized: false,
    store: store
  }
))

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(authRoute)
app.use(homeRoute)
app.use(productRoute)
app.use('/admin', adminRoute)

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });