const express = require('express')
const { check, body } = require('express-validator')

const adminController = require('../controller/admin')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getProducts)

router.post('/add-product',
    [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('price').isFloat(),
    body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ], 
    isAuth, 
    adminController.postAddProduct
)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product/:productId',  
    [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
    ], 
    isAuth, 
    adminController.postEditProduct
)

router.post('/delete-product/:productId', isAuth, adminController.postDeleteProduct)

module.exports = router 