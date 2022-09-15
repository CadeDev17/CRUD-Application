const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
    res.render('./admin/add-products.ejs', {
        pageTitle: 'Add Products',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
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
                product: product
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.params.productId
    console.log(prodId)
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedDescription = req.body.description
    const updatedImageUrl = req.body.imageUrl

    Product.findById(prodId)
        .then(product => {
            console.log(product)
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
    console.log(prodId)
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('Product Removed')
            res.redirect('/products')
        })
        .catch(err => {
            console.log(err)
        })
}