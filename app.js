// ToDo:
// User model is created and you can now use req.user to access the current user and their cart
// Use that information to set up the functionality of the cart for all GET/POST routes 
// GET cart, POST place items in cart, DELETE items from cart, etc.

const express = require('express') 
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const User = require('./model/user')

const homeRoute = require('./routes/home')
const productRoute = require('./routes/shop')
const adminRoute = require('./routes/admin')

const MONGODB_URI =
    'mongodb+srv://Decryptr:Yko35961!@cluster0.rg76ghz.mongodb.net/shop';

const app = express() 

app.set('view engine', 'ejs')
app.set('views', 'views') 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('632488f0daf4c78f16ad2d64')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use(homeRoute)
app.use(productRoute)
app.use('/admin', adminRoute)

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Cade',
          email: 'Cade@gmail.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });