const Customer = require("../models/customer")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { name, password, phone, email, username } = req.body
    if (!name || !password || !phone || !email || !username) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await Customer.findOne({ email: email }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate email" })
    }
    const duplicate2 = await Customer.findOne({ username: username }).lean()
    if (duplicate2) {
        return res.status(409).json({ message: "Duplicate username" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const custObject = { name, username, password: hashedPwd, phone, email }
    const cust = await Customer.create(custObject)
    if (cust) { // Created
        return res.status(201).json({
            message: `New customer ${cust.name} created`
        })
    } else {
        return res.status(400).json({ message: 'Invalid customer received' })

    }
}
const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundCustomer = await Customer.findOne({ username }).lean()
    if (!foundCustomer) {
        console.log("Customer not found");
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundCustomer.password)
    console.log("Password match result:", match);
    if (!match) {
        console.log("Password does not match");
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const custInfo = {
        _id: foundCustomer._id, name: foundCustomer.name,
        phone: foundCustomer.phone, username: foundCustomer.username,
        email: foundCustomer.email, role: 'Customer'
    }
    const accessToken = jwt.sign(custInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
    res.json({accessToken:accessToken})
}
module.exports = { register, login }