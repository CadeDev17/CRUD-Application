// ToDo pt.1:
// - Add file picker for the add-product part of admin products √
// - Install Multer and configure it to decifer file names and paths √
// - Store files in DB √
// - Make sure that imageUrl is removed from every appropriate area √
// - Create the invoice links on orders √
// - build out pdf dynamically with pdfkit √
// - Make pdf specific to the order using authentication √

const express = require('express') 
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')

const User = require('./model/user')

const homeRoute = require('./routes/home')
const productRoute = require('./routes/shop')
const adminRoute = require('./routes/admin')
const authRoute = require('./routes/auth')
const { file } = require('pdfkit')

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

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.set('view engine', 'ejs')
app.set('views', 'views') 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
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