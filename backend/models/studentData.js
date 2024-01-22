const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    projectDescription: {
        type: String,
        required: true,
    },
    category: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    approved: {
        type: Boolean,
    }
})
module.exports = mongoose.model('StudentProject', userSchema)