const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema([
    {
        id: {
            type: String,
        },
        message: {
            type: String,
        }
    }
])
module.exports = mongoose.model('Message', userSchema)