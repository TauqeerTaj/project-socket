const { body } = require('express-validator')
const express = require('express')
const router = express.Router()
const User = require('../models/user')

const authController = require('../controllers/auth')

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    console.log("doc check:", userDoc, value)
                    if (userDoc) {
                        throw new Error("Email already exist")
                    }
                })
                .catch(err => { console.log('bug detected', err) })
        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty(),
    body('category').not().isEmpty()
],authController.signup)
    
    router.post('/login', authController.login)
    router.get('/students', authController.students)
    router.get('/supervisors', authController.supervisors)

module.exports = router