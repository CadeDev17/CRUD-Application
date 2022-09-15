const express = require('express') 

const productsController = require('../controller/shop')

const router = express.Router()

router.get('/products', productsController.getProducts)

module.exports = router