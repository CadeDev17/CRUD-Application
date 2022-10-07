const express = require('express')
const { check, body } = require('express-validator')
const User = require('../model/user')

const authController = require('../controller/auth')


const router = express.Router()

router.get('/login', authController.getLogin)

router.post('/login', 
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
)

router.get('/signup', authController.getSignup)

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userInfo => {
                    if (userInfo){
                        return Promise.reject(
                            'The email you entered already exists.'
                        )
                    }
                })
            })
            .normalizeEmail(),
        body('password', 'Please enter an alphanumeric password with a min-length of 5')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password){
                    throw new Error('passwords have to match!')
                }
                return true
            })

    ],
    authController.postSignup
 )


router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:tokenId', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router