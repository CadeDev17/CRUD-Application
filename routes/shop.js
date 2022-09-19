const express = require('express') 
const { SchemaTypeOptions } = require('mongoose')

const productsController = require('../controller/shop')

const router = express.Router()

router.get('/products', productsController.getProducts)

router.get('/cart', productsController.getCart)

router.post('/cart', productsController.postCart)

router.get('/mobile-view', productsController.getMobileView)

module.exports = router