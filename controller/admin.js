const { validationResult } = require('express-validator');

const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
    res.render('./admin/add-products.ejs', {
        pageTitle: 'Add Products',
        editing: false,
        isAuthenticated: req.session.isLoggedIn,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('./admin/edit-product.ejs', {
          pageTitle: 'Add Product',
          editing: false,
          hasError: true,
          product: {
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description
          },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array()
        });
    }
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    })
    product.save()
        .then(result => {
            console.log('Product Created')
            res.redirect('/products')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                res.redirect('/')
            }
            res.render('./admin/add-products.ejs', {
                pageTitle: "Edit Product",
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.params.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedDescription = req.body.description
    const updatedImageUrl = req.body.imageUrl
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status(422).render('./admin/edit-product.ejs', {
            pageTitle: 'Edit Product',
            editing: true,
            hasError: true,
            product: {
              title: updatedTitle,
              imageUrl: updatedImageUrl,
              price: updatedPrice,
              description: updatedDesc,
              _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => {
            // console.log(product)
            product.title = updatedTitle
            product.price = updatedPrice
            product.description = updatedDescription
            product.imageUrl = updatedImageUrl

            return product.save()
        })
        .then(result => {
            console.log('Updated Product')
            res.redirect('/products')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('Product Removed')
            res.redirect('/products')
        })
        .catch(err => {
            console.log(err)
        })
}