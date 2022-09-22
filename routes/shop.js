const express = require('express') 

const shopController = require('../controller/shop')

const router = express.Router()

router.get('/products', shopController.getProducts)

router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

router.post('/delete-cart-item', shopController.postCartDeleteProduct)

router.get('/mobile-view', shopController.getMobileView)

router.post('/set-order', shopController.setOrder)

router.get('/orders', shopController.getOrder)

module.exports = router