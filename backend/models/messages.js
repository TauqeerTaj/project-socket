const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema([
    {
        id: {
            type: String,
        },
        receiver_id: {
            type: String,
        },
        message: {
            type: String,
        },
        date: {
            type: String,
        }
    }
],{ timestamps: true })
module.exports = mongoose.model('Message', userSchema)