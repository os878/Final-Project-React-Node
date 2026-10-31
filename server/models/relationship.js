const mongoose = require('mongoose')

const relationshipSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Relationship', relationshipSchema)