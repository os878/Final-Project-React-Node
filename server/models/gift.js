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
    styles: [{
        type: String,
        enum: ['שימושי', 'דקורטיבי', 'חווייתי', 'אישי/מרגש', 'יוקרתי', 'מצחיק/מקורית']
    }],
    DedicationPersonalization: {
        type: Boolean,
        required: true
    },
    // מתנה יכולה להתאים לכמה קטגוריות, אירועים וקשרים
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }],
    relationships: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Relationship',
        required: true
    }],
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        trim: true // מוחק רווחים וטאבים בתחילת הקישור ובסופו
    },
    description: {
        type: String
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.models.Gift || mongoose.model('Gift', giftSchema)