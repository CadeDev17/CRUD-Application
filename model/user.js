const mongoose = require('mongoose')
const { schema } = require('./product')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    cart: {
        items: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }
})

userSchema.methods.addToCart = function(product) {
    // This will allow us to figure out if we have cart items already 
    // and just increment the amount of that product or add it's first instance 
    // of it in the cart
    const cartProdIndex = this.cart.items.findIndex(cartProd => {
        return cartProd.productId.toString() === product._id.toString()
    })

    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]

    if (cartProdIndex >= 0) {
        newQualtity = this.cart.items[cartProdIndex].quantity + 1
        updatedCartItems[cartProdIndex].quantity = newQuantity
    }else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart
    return this.save()
}

module.exports = mongoose.model('User', userSchema)