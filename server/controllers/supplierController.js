const Supplier = require("../models/supplier")

// יצירת ספק חדש
const createNewSupplier = async (req, res) => {
    const { name, password, phone, email, companyName } = req.body

    // בדיקת שדות חובה לפי המודל החדש
    if (!name || !password || !phone || !email) {
        return res.status(400).json({ message: 'name, password, phone and email are required' })
    }

    const supplier = await Supplier.create({
        name,
        password,
        phone,
        email,
        companyName 
    })

    if (supplier) {
        return res.status(201).json({ message: 'New Supplier created', supplier })
    } else {
        return res.status(400).json({ message: 'Invalid Supplier data' })
    }
}

// מציאת ספק לפי מזהה (מ-req.body או req.params)
const findByIdS = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Supplier id is required' })
    }

    const supplier = await Supplier.findById(id).lean()
    if (!supplier) {
        return res.status(404).json({ message: 'The supplier was not found' })
    }
    res.json(supplier)
}

// קבלת כל הספקים
const getAllSuppliers = async (req, res) => {
    const suppliers = await Supplier.find().lean()

    if (!suppliers?.length) {
        return res.status(400).json({ message: 'No suppliers found' })
    }
    res.json(suppliers)
}

// עדכון ספק
const updateSupplier = async (req, res) => {
    const { id, name, password, phone, email, companyName } = req.body

    if (!id || !name || !password || !phone || !email) {
        return res.status(400).json({ message: 'id, name, password, phone and email are required' })
    }

    const supplier = await Supplier.findById(id).exec()
    if (!supplier) {
        return res.status(400).json({ message: 'The supplier was not found' })
    }

    supplier.name = name
    supplier.password = password
    supplier.phone = phone
    supplier.email = email
    supplier.companyName = companyName

    const updatedSupplier = await supplier.save()
    res.json({ message: `'${updatedSupplier.name}' updated successfully` })
}

// מחיקת ספק
const deleteSupplier = async (req, res) => {
    const { id } = req.body
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

    const reply = `Supplier '${supplierName}' ID ${supplierId} deleted`
    res.json(reply)
}

module.exports = {
    createNewSupplier,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
    findByIdS
}