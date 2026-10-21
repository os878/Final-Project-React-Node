const Supplier = require("../models/supplier")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { name, password, phone, email, companyName } = req.body
    if (!name || !password || !phone || !email) {
        return res.status(400).json({ message: 'name, password, phone and email are required' })
    }
    const duplicate = await Supplier.findOne({ email: email }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate email" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const suppObject = { name, password: hashedPwd, phone, email, companyName }
    const supp = await Supplier.create(suppObject)
    if (supp) { // Created
        return res.status(201).json({
            message: `New supplier ${supp.name} created`
        })
    } else {
        return res.status(400).json({ message: 'Invalid supplier received' })

    }
}
const login = async (req, res) => {
    const { name, password } = req.body

    if (!name || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundSupplier = await Supplier.findOne({ name }).lean()
    if (!foundSupplier) {
        console.log("Supplier not found");
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundSupplier.password)
    console.log("Password match result:", match);
    if (!match) {
        console.log("Password does not match");
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const suppInfo = {
        _id: foundSupplier._id, name: foundSupplier.name,
        phone: foundSupplier.phone, companyName: foundSupplier.companyName,
        email: foundSupplier.email
    }
    const accessToken = jwt.sign(suppInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})
}
module.exports = { register, login }