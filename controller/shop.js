const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(product => {
            res.render('./shop/products.ejs', {
                pageTitle: 'Products',
                prod: product,
            })
        })
        .catch(err => {
            console.log(err)
        })
}


exports.getCart = (req, res, next) => {
    req.user 
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            res.render('./shop/cart.ejs', {
                pageTitle: 'Your Cart',
                products: products
            })
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect('/cart')
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        })
}













exports.getMobileView = (req, res, next) => {
    res.render('../views/includes/mobile-view.ejs', {
        pageTitle: 'Menu'

    })
}