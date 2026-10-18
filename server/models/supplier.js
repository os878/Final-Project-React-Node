const mongoose = require('mongoose')
const supplierSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    companyName: {
        type: String
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Supplier', supplierSchema)