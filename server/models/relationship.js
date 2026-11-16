const mongoose = require('mongoose')

const relationshipSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        trim: true
    },
    // שם האייקון שמוצג בשאלון (נבחר מגלריה בדף התחזוקה). ריק = לפי השם / שלוש נקודות
    icon: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Relationship', relationshipSchema)