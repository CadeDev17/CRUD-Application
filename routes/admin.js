const express = require('express')
const path = require('path')

const adminController = require('../controller/admin')

const router = express.Router()

router.get('/add-product', adminController.getProducts)

router.post('/add-product', adminController.postAddProduct)

router.get('/edit-product/:productId', adminController.getEditProduct)

router.post('/edit-product/:productId', adminController.postEditProduct)

router.get('/delete-product/:productId', adminController.postDeleteProduct)

module.exports = router 