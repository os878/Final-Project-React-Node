
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    gift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gift',
        required: true
    },

    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    preferredContact: {
        type: String,
        enum: ['WhatsApp', 'Phone', 'Email'],
        required: true
    },

    status: {
        type: String,
        enum: ['New', 'InProgress', 'Handled'],
        default: 'New'
    }

}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
