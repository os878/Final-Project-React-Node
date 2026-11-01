const Gift = require("../models/gift")
const mongoose = require("mongoose")
const matchGifts = require("../services/Giftservices")
const createNewGift = async (req, res) => {
    const { 
        name, 
        forGender, 
        age1, 
        age2, 
        category, 
        event, 
        relationship, 
        color, 
        price, 
        image, 
        description, 
        styles, 
        DedicationPersonalization 
    } = req.body

    // בדיקת שדות חובה לפי המודל
    if (
        !name || 
        !forGender || 
        age1 == null || 
        age2 == null || 
        !category || 
        !event || 
        !relationship || 
        !color || 
        price == null || 
        DedicationPersonalization == null
    ) {
        return res.status(400).json({
            message: 'name, forGender, age1, age2, category, event, relationship, color, price and DedicationPersonalization are required'
        })
    }

    if (age1 < 0 || age2 < age1 || price < 0) {
        return res.status(400).json({
            message: 'Invalid age range or price'
        })
    }

    try {
        const gift = await Gift.create({ 
            name, 
            forGender, 
            age1, 
            age2, 
            category, 
            event, 
            relationship, 
            color, 
            price, 
            image, 
            description, 
            styles, 
            DedicationPersonalization, 
            supplier: req.user._id 
        })

        if (gift) {
            return res.status(201).json({ message: 'New Gift created', gift })
        } else {
            return res.status(400).json({ message: 'Invalid Gift' })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Error creating gift', error: error.message })
    }
}

const findByIdGift = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Gift id is required'
        })
    }

    const gift = await Gift.findById(id)
        .populate('category')
        .populate('event')
        .populate('relationship')
        .populate('supplier', 'name companyName')

    if (!gift) {
        return res.status(404).json({ message: 'The gift was not found' })
    }

    res.json(gift)
}

const findByIdSupplier = async (req, res) => {
    const gifts = await Gift.find({
        supplier: req.user._id
    })
    .populate('category')
    .populate('event')
    .populate('relationship')

    if (!gifts.length) {
        return res.status(404).json({ message: 'No gifts found for this supplier' })
    }

    res.json(gifts)
}

const getAllGifts = async (req, res) => {
    const gifts = await Gift.find()
        .populate('category')
        .populate('event')
        .populate('relationship')
        .populate('supplier', 'name companyName')
        .lean()

    if (!gifts.length) {
        return res.status(404).json({
            message: 'No gifts found'
        })
    }

    res.json(gifts)
}

const updateGift = async (req, res) => {
    const allowedFields = new Set([
        'id', 'name', 'forGender', 'age1', 'age2', 'category', 'event', 
        'relationship', 'color', 'price', 'image', 'description', 
        'styles', 'DedicationPersonalization'
    ])

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) ||
        Object.keys(req.body).some(field => !allowedFields.has(field))) {
        return res.status(400).json({
            message: 'Unexpected or invalid gift update fields'
        })
    }

    const { 
        id, 
        name, 
        forGender, 
        age1, 
        age2, 
        category, 
        event, 
        relationship, 
        color, 
        price, 
        image, 
        description, 
        styles, 
        DedicationPersonalization 
    } = req.body

    const numericValues = [age1, age2, price]
    const hasInvalidNumber = numericValues.some(value =>
        (typeof value !== 'number' && typeof value !== 'string') ||
        (typeof value === 'string' && value.trim() === '') ||
        !Number.isFinite(Number(value))
    )

    const validStyles = ['שימושי', 'דקורטיבי', 'חווייתי', 'אישי/מרגש', 'יוקרתי', 'מצחיק/מקורית']

    if (
        typeof id !== 'string' || !mongoose.isValidObjectId(id) ||
        typeof name !== 'string' || !name.trim() ||
        !['בן', 'בת', 'לא משנה'].includes(forGender) ||
        hasInvalidNumber ||
        typeof category !== 'string' || !mongoose.isValidObjectId(category) ||
        typeof event !== 'string' || !mongoose.isValidObjectId(event) ||
        typeof relationship !== 'string' || !mongoose.isValidObjectId(relationship) ||
        typeof color !== 'string' || !color.trim() ||
        typeof DedicationPersonalization !== 'boolean' ||
        (styles && (!Array.isArray(styles) || styles.some(s => !validStyles.includes(s)))) ||
        (image != null && typeof image !== 'string') ||
        (description != null && typeof description !== 'string')
    ) {
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
        gift.event = event
        gift.relationship = relationship
        gift.color = color
        gift.price = numericPrice
        gift.image = image
        gift.description = description
        gift.styles = styles
        gift.DedicationPersonalization = DedicationPersonalization

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
const matchGiftsController = async (req, res) => {
    try {
        const matchingGifts = await matchGifts(req.body)
        return res.json({ gifts: matchingGifts })
    } catch (error) {
        return res.status(500).json({ message: 'Unable to match gifts' })
    }
}

module.exports = {
    createNewGift,
    getAllGifts,
    updateGift,
    deleteGift,
    findByIdSupplier,
    findByIdGift,
    matchGiftsController
}