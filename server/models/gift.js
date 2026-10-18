
const mongoose = require('mongoose')

const giftSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    forGender: {
        type: String,
        enum: ['בן', 'בת', 'לא משנה'],
        required: true
    },
    age1: {
        type: Number,
        required: true
    },
    age2: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true // או false, בהתאם לרצונך אם השדה חובה
}
}, {
    timestamps: true
})

module.exports = mongoose.model('Gift', giftSchema)
