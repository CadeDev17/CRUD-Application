// ToDo:
// - Go through and make it so you can only view certain pages/nav-links if you are authenticated √
// - Add isAuthenticated to every res.render() √
// - Fix addToCart functionality √
// - Session data will be stored in mongodb after initializing mongodbstore. You should be able to click
//   login, get a new session cookie and see the reflected data/user/session in mongo compass √
// - Work on the user authentication and attaching users to their cart, session, and profile √
// - Add logout functionality that destroys the session and removes authentication access √

const express = require('express') 
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const User = require('./model/user')

const homeRoute = require('./routes/home')
const productRoute = require('./routes/shop')
const adminRoute = require('./routes/admin')
const authRoute = require('./routes/auth')

const MONGODB_URI =
    'mongodb+srv://Decryptr:Yko35961!@cluster0.rg76ghz.mongodb.net/shop';

const app = express() 
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.set('view engine', 'ejs')
app.set('views', 'views') 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session(
  {
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  }
))

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

app.use(authRoute)
app.use(homeRoute)
app.use(productRoute)
app.use('/admin', adminRoute)

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Cade R.',
          email: 'Cade@testedddd.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });