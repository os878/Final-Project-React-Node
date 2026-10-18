const Supplier = require("../models/supplier")

const createNewSupplier = async (req, res) => {
    const {  name, phone, email,companyName } = req.body
    if (!name || !phone || !email) { // Confirm data
        return res.status(400).json({ message: 'name, phone and email are required' })
    }
    const supplier = await Supplier.create({
        name, phone, email, companyName 
    })
    if (supplier) { // Created
        return res.status(201).json({ message: 'New Supplier created' })
    } else {
        return res.status(400).json({ message: 'Invalid Supplier ' })
    }
}

const findByIdS=async (req,res)=>{
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Supplier id is required' })
    }
    const supplier = await Supplier.findById(id)
    if (!supplier) {
        return res.status(404).json({ message: 'the supplier not found' })
    }
    res.json(supplier)
}
const getAllSuppliers = async (req, res) => {

    const suppliers = await Supplier.find().lean()

    if (!suppliers?.length) {
        return res.status(400).json({ message: 'No supplier found' })
    }
    res.json(suppliers)
}

const updateSupplier = async (req, res) => {
    const {id, name, phone, email, companyName} = req.body

    if (!id ||!name || !phone || !email) {
        return res.status(404).json({ message: 'id, name, phone and email are required' })
    }
    const supplier = await Supplier.findById(id).exec()
    if (!supplier) {
        return res.status(400).json({ message: 'the supplier not found' })
    }
    supplier.name = name
    supplier.phone = phone
    supplier.email = email
    supplier.companyName = companyName


    const updatedSupplier = await supplier.save()
    res.json(`'${updateSupplier.name}' updated`)

}
const deleteSupplier = async (req, res) => {
    const {id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Supplier id is required' })
    }

    const supplier = await Supplier.findById(id).exec()
    if (!supplier) {
        return res.status(400).json({ message: 'Supplier not found' })
    }
    const supplierName = supplier.name
    const supplierId = supplier._id

    await supplier.deleteOne()

    const reply = `supplier '${supplierName}' ID ${supplierId} deleted`
    res.json(reply)
}
module.exports = {
    createNewSupplier,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
    findByIdS
}

