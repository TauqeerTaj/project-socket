const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.signup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!')
        error.statusCode = 422;
        error.data = errors.array()
        throw error
    }
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const category = req.body.category;
    const profileImage = req.body.profileImage;

    bcrypt
        .hash(password, 12)
        .then(async hashedPW => {
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPW,
                category: category,
                profileImage: profileImage
            })
            await user.save()
            res.status(201).json({ message: 'User created successfully!', userId: user._id })
            return
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(new Error("email already exist"))
        })

    // try {
    //     const user = new User({
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         email: req.body.email,
    //         password: req.body.password,
    //         category: req.body.category,
    //         profileImage: req.body.profileImage
    //     })
    //     await user.save()
    //     res.status(201).send({ message: 'user created successfully!', userId: user._id })
    //     return
    // }
    // catch (err) {
    //     console.log("errorororooror:")
    //     res.status(500).send({ message: 'Email already exist!', error: err })
    //     return
    // }
}

exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('No user found!')
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Wrong Password!")
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'secret', { expiresIn: '1h' })
            res.status(200).send({token: token, user: loadedUser })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

//Students collection
exports.students = (req, res, next) => {
    User.find({category: 'Student'},{
        firstName: 1,
        lastName: 1,
        profileImage: 1
    })
    .then(studentList => {
        res.status(200).send({list: studentList})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
} 

//Supervisors collection
exports.supervisors = (req, res, next) => {
    User.find({category: 'Supervisor'},{
        firstName: 1,
        lastName: 1,
        profileImage: 1
    })
    .then(supervisorList => {
        res.status(200).send({list: supervisorList})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
} 
