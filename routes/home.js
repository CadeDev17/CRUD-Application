const express = require('express') 
const path = require('path')

const homeController = require('../controller/home')

const router = express.Router()

router.get('/', homeController.getHome)

module.exports = router