const Gift = require("../models/gift")
const mongoose = require("mongoose")

const createNewGift = async (req, res) => {
    const { name, forGender, age1, age2, category, color, price, image, description } = req.body

    if (!name || !forGender || age1 == null || age2 == null || !category || !color || !price) {
        return res.status(400).json({
            message: 'name, forGender, age1, age2, category, color and price are required'
        })
    }

    if (age1 < 0 || age2 < age1 || price < 0) {
        return res.status(400).json({
            message: 'Invalid age range or price'
        })
    }

    const gift = await Gift.create({ name, forGender, age1, age2, category, supplier: req.user._id, color, price, image, description })

    if (gift) {
        return res.status(201).json({ message: 'New Gift created', gift })
    } else {
        return res.status(400).json({ message: 'Invalid Gift' })
    }
}

const findByIdG = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Gift id is required'
        })
    }

    const gift = await Gift.findById(id).populate('category').populate('supplier', 'name companyName')

    if (!gift) {
        return res.status(404).json({ message: 'The gift was not found' })
    }

    res.json(gift)
}

const getAllGifts = async (req, res) => {
    const gifts = await Gift.find().populate('category').populate('supplier', 'name companyName').lean()

    if (!gifts.length) {
        return res.status(404).json({
            message: 'No gifts found'
        })
    }

    res.json(gifts)
}

const updateGift = async (req, res) => {
    const allowedFields = new Set([
        'id', 'name', 'forGender', 'age1', 'age2', 'category',
        'color', 'price', 'image', 'description'
    ])

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) ||
        Object.keys(req.body).some(field => !allowedFields.has(field))) {
        return res.status(400).json({
            message: 'Unexpected or invalid gift update fields'
        })
    }

    const { id, name, forGender, age1, age2, category, color, price, image, description } = req.body
    const numericValues = [age1, age2, price]
    const hasInvalidNumber = numericValues.some(value =>
        (typeof value !== 'number' && typeof value !== 'string') ||
        (typeof value === 'string' && value.trim() === '') ||
        !Number.isFinite(Number(value))
    )

    if (typeof id !== 'string' || !mongoose.isValidObjectId(id) ||
        typeof name !== 'string' || !name.trim() ||
        !['בן', 'בת', 'לא משנה'].includes(forGender) ||
        hasInvalidNumber ||
        typeof category !== 'string' || !mongoose.isValidObjectId(category) ||
        typeof color !== 'string' || !color.trim() ||
        (image != null && typeof image !== 'string') ||
        (description != null && typeof description !== 'string')) {
        return res.status(400).json({
            message: 'Invalid gift data'
        })
    }

    const numericAge1 = Number(age1)
    const numericAge2 = Number(age2)
    const numericPrice = Number(price)

    if (numericAge1 < 0 || numericAge2 < numericAge1 || numericPrice < 0) {
        return res.status(400).json({ message: 'Invalid age range or price' })
    }

    try {
        const gift = await Gift.findOne({ _id: id, supplier: req.user._id }).exec()

        if (!gift) {
            return res.status(404).json({ message: 'The gift was not found' })
        }

        gift.name = name
        gift.forGender = forGender
        gift.age1 = numericAge1
        gift.age2 = numericAge2
        gift.category = category
        gift.color = color
        gift.price = numericPrice
        gift.image = image
        gift.description = description

        const updatedGift = await gift.save()

        return res.json({
            message: `'${updatedGift.name}' updated`,
            gift: updatedGift
        })
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid gift data' })
        }
        return res.status(500).json({ message: 'Unable to update gift' })
    }
}

const deleteGift = async (req, res) => {
    const id = req.body?.id

    if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'A valid gift id is required'
        })
    }

    try {
        const gift = await Gift.findOne({ _id: id, supplier: req.user._id }).exec()

        if (!gift) {
            return res.status(404).json({ message: 'Gift not found' })
        }

        const giftName = gift.name
        const giftId = gift._id

        await gift.deleteOne()

        return res.json(`Gift '${giftName}' ID ${giftId} deleted`)
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete gift' })
    }
}

module.exports = {
    createNewGift,
    getAllGifts,
    updateGift,
    deleteGift,
    findByIdG
}