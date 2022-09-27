const Product = require('../model/product')
const Order = require('../model/order')

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(product => {
            res.render('./shop/products.ejs', {
                pageTitle: 'Products',
                prod: product,
                isAuthenticated: req.session.isLoggedIn
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
                products: products,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    console.log(req.user)
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


exports.getOrder = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id})
        .then(orders => {
            res.render('./shop/orders.ejs', {
                pageTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.setOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            console.log(user)
            const orderedProducts = user.cart.items.map(item => {
                return { quantity: item.quantity, product: { ...item.productId._doc } }
            })
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: orderedProducts
            })
            return order.save()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err)
        })
}










exports.getMobileView = (req, res, next) => {
    res.render('../views/includes/mobile-view.ejs', {
        pageTitle: 'Menu',
        isAuthenticated: req.session.isLoggedIn

    })
}