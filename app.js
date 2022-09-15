// ToDo:
// Can now Create, Read, Update, and Delete products in the store
// Make views accessable to mobile users
// Begin working on authorizing users and adding more security
// Create User model and use that to configure the login, signup, session, cookies, etc.

const express = require('express') 
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

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


app.use(homeRoute)
app.use(productRoute)
app.use(adminRoute)

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });