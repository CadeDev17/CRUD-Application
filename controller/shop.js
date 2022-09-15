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