const Customer = require("../models/customer")

const createNewCustomer = async (req, res) => {
    const { name, password, username, email, phone } = req.body
    if (!name || !password || !username || !email || !phone) { // Confirm data
        return res.status(400).json({ message: 'name, password, username, email and phone are required' })
    }
    const customer = await Customer.create({
        name, password, username, email, phone
    })
    if (customer) { // Created
        return res.status(201).json({ message: 'New Customer created' })
    } else {
        return res.status(400).json({ message: 'Invalid Customer data' })
    }
}

const findByIdC = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Customer id is required' })
    }
    const customer = await Customer.findById(id)
    if (!customer) {
        return res.status(404).json({ message: 'the customer not found' })
    }
    res.json(customer)
}

const getAllCustomers = async (req, res) => {
    const customers = await Customer.find().lean()

    if (!customers?.length) {
        return res.status(400).json({ message: 'No customer found' })
    }
    res.json(customers)
}

const updateCustomer = async (req, res) => {
    const { id, name, password, username, email, phone } = req.body

    if (!id || !name || !password || !username || !email || !phone) {
        return res.status(400).json({ message: 'id, name, password, username, email and phone are required' })
    }
    const customer = await Customer.findById(id).exec()
    if (!customer) {
        return res.status(400).json({ message: 'the customer not found' })
    }
    customer.name = name
    customer.password = password
    customer.username = username
    customer.email = email
    customer.phone = phone

    const updatedCustomer = await customer.save()
    res.json(`'${updatedCustomer.name}' updated`)
}

const deleteCustomer = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Customer id is required' })
    }

    const customer = await Customer.findById(id).exec()
    if (!customer) {
        return res.status(400).json({ message: 'Customer not found' })
    }
    const customerName = customer.name
    const customerId = customer._id

    await customer.deleteOne()

    const reply = `customer '${customerName}' ID ${customerId} deleted`
    res.json(reply)
}

module.exports = {
    createNewCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
    findByIdC
}