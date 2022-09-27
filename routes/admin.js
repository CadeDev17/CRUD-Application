const express = require('express')

const adminController = require('../controller/admin')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getProducts)

router.post('/add-product', isAuth, adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product/:productId', isAuth, adminController.postEditProduct)

router.post('/delete-product/:productId', isAuth, adminController.postDeleteProduct)

module.exports = router 