
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    // שם האייקון שמוצג בשאלון (נבחר מגלריה בדף התחזוקה). ריק = לפי השם / שלוש נקודות
    icon: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Category', categorySchema)
