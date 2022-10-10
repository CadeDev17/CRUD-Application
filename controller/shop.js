const Product = require('../model/product')
const Order = require('../model/order')
const fs = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')

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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId)
        .then(order => {
            if (!order){
                return next(new Error('Order not found'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()){
                return next(new Error('Unauthorized'));
            }

            const invoiceName = `invoice-${orderId}.pdf`
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const PDFDoc = new PDFDocument()
            res.setHeader('Content-type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')

            PDFDoc.pipe(fs.createWriteStream(invoicePath))
            PDFDoc.pipe(res)

            PDFDoc.fontSize(26).text('Invoice', {
                underline: true
              });
              PDFDoc.text('-----------------------');
              let totalPrice = 0;
              order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                PDFDoc
                  .fontSize(14)
                  .text(
                    prod.product.title +
                      ' - ' +
                      prod.quantity +
                      ' x ' +
                      '$' +
                      prod.product.price
                  );
              });
              PDFDoc.text('---');
              PDFDoc.fontSize(20).text('Total Price: $' + totalPrice);
        
              PDFDoc.end();
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
}










exports.getMobileView = (req, res, next) => {
    res.render('../views/includes/mobile-view.ejs', {
        pageTitle: 'Menu',
        isAuthenticated: req.session.isLoggedIn

    })
}