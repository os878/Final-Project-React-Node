
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Category', categorySchema)
