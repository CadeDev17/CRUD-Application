const express = require('express') 

const productsController = require('../controller/shop')

const router = express.Router()

router.get('/products', productsController.getProducts)

router.get('/mobile-view', productsController.getMobileView)

module.exports = router