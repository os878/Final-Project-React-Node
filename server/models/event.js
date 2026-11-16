
const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    // המתנה שהתמונה שלה מייצגת את האירוע בדף הנחיתה ("לאיזה אירוע?").
    // המנהל בוחר בדף התחזוקה. ריק = בחירה אוטומטית
    coverGift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gift',
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Event', eventSchema)
