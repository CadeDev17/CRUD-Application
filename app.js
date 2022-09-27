// ToDo:
// - Add signup functionality √√
// - Check DB for existing emails √√
// - use bcrypt for excrypting passwords in the DB √√
// - add route protection from users that are not signed using middleware function √√
// - Once signin functionality is complete, edit the dummy data for logging in to make it query the DB for users √√
// - Add csrf protection √√
// - Add error messages and figure out req.flash() bug √√
// - Go back and re-write the above steps from scratch √√

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