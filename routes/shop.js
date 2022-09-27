const express = require('express') 

const shopController = require('../controller/shop')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/products', shopController.getProducts)

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.post('/delete-cart-item', isAuth, shopController.postCartDeleteProduct)

router.get('/mobile-view', shopController.getMobileView)

router.post('/set-order', isAuth, shopController.setOrder)

router.get('/orders', isAuth, shopController.getOrder)

module.exports = router