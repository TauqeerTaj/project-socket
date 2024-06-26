const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        // required: true
    }
})
module.exports = mongoose.model('User', userSchema)