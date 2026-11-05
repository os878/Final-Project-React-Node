const Gift = require("../models/gift")
const Category=require('../models/category')
const Event=require('../models/event')
const Relationship = require('../models/relationship')
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
    try {
        const gifts = await Gift.find()
            .populate('category')
            .populate('event')
            .populate('relationship')
            .exec()

        return res.status(200).json(gifts)
    } catch (error) {
        console.error("Error in getAllGifts:", error)
        return res.status(500).json({ 
            message: 'שגיאה בשרת בעת טעינת המתנות', 
            error: error.message 
        })
    }
}
const updateGift = async (req, res) => {
    const { id, age1, age2, price } = req.body

    if (Number(age1) < 0 || Number(age2) < Number(age1) || Number(price) < 0) {
        return res.status(400).json({ message: 'Invalid age range or price' })
    }

    try {
        const filter = req.user.role === 'Admin' 
            ? { _id: id } 
            : { _id: id, supplier: req.user._id }

        const gift = await Gift.findOne(filter).exec()

        if (!gift) {
            return res.status(404).json({ message: 'The gift was not found' })
        }

        Object.assign(gift, req.body)

        let updatedGift = await gift.save()
        
        // טעינת המסמכים המלאים ללא הגבלת שדות
        updatedGift = await updatedGift.populate([
            { path: 'category' },
            { path: 'event' },
            { path: 'relationship' }
        ])

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