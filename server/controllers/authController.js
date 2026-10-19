const Supplier = require("../models/supplier")
const bcrypt = require('bcrypt')

const login = async (req, res) => {
    const { name, password, phone, email, companyName } = req.body
    if (!name || !password || !phone || !email) {
        return res.status(400).json({ message: 'name, password, phone and email are required' })
    }
    const duplicate = await Supplier.findOne({ email: email }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate email" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const suppObject = { name,password: hashedPwd, phone, email, companyName  }
    const supp = await Supplier.create(suppObject)
    if (supp) { // Created
        return res.status(201).json({
            message: `New supplier ${supp.name} created` })
    } else {
        return res.status(400).json({ message: 'Invalid supplier received' })

    }
}
    const register = async (req, res) => { }
    module.exports = { login, register }