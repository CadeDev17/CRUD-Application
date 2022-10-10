const { validationResult } = require('express-validator');

const fileUtil = require('../util/file')

const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
    res.render('./admin/add-products.ejs', {
        pageTitle: 'Add Products',
        editing: false,
        errorMessage: null,
        isAuthenticated: req.session.isLoggedIn,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const image = req.file
    const price = req.body.price
    const description = req.body.description
    if (!image) {
        return res.status(422).render('./admin/add-products', {
          pageTitle: 'Add Product',
          editing: false,
          hasError: true,
          product: {
            title: title,
            price: price,
            description: description
          },
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: 'Attached file is not an image.',
          validationErrors: []
        });
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('./admin/add-product.ejs', {
          pageTitle: 'Add Product',
          editing: false,
          hasError: true,
          product: {
            title: title,
            price: price,
            description: description
          },
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array()
        });
    }

    const imageUrl = image.path

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
    const image = req.file
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status(422).render('./admin/edit-product.ejs', {
            pageTitle: 'Edit Product',
            editing: true,
            hasError: true,
            product: {
              title: updatedTitle,
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
            if (image) {
                fileUtil.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }

            return product.save().then(result => {
                console.log('Updated Product')
                res.redirect('/products')
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
            if (!product) {
            return next(new Error('Product not found.'));
            }
            fileUtil.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(() => {
            console.log('Product Removed')
            res.redirect('/products')
        })
        .catch(err => {
            console.log(err)
        })
}