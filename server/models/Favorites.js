const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    gift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gift',
        required: true
    }
}, {
    timestamps: true
});

// מניעת שמירה כפולה של אותה מתנה לאותו לקוח
favoriteSchema.index(
    { customer: 1, gift: 1 },
    { unique: true }
);

module.exports = mongoose.model('Favorites', favoriteSchema);