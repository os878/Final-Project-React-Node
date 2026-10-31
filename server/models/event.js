
const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Event', eventSchema)
