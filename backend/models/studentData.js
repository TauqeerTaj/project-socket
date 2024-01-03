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
        type: String,
        required: true
    }
})
module.exports = mongoose.model('StudentProject', userSchema)