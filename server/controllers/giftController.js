const Gift = require("../models/gift")

const createNewGift = async (req, res) => {
    const { name, forGender, age1, age2, category, supplier, color, price, image, description } = req.body

    if (!name || !forGender || age1 == null || age2 == null || !category || !supplier || !color || !price) {
        return res.status(400).json({
            message: 'name, forGender, age1, age2, category, supplier, color and price are required'
        })
    }

    if (age1 < 0 || age2 < age1 || price < 0) {
        return res.status(400).json({
            message: 'Invalid age range or price'
        })
    }

    const gift = await Gift.create({ name, forGender, age1, age2, category, supplier, color, price, image, description })

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

    const gift = await Gift.findById(id).populate('category').populate('supplier')

    if (!gift) {
        return res.status(404).json({ message: 'The gift was not found' })
    }

    res.json(gift)
}

const getAllGifts = async (req, res) => {
    const gifts = await Gift.find().populate('category').populate('supplier').lean()

    if (!gifts.length) {
        return res.status(404).json({
            message: 'No gifts found'
        })
    }

    res.json(gifts)
}

const updateGift = async (req, res) => {
    const { id, name, forGender, age1, age2, category, supplier, color, price, image, description } = req.body

    if (!id || !name || !forGender || age1 == null || age2 == null || !category || !supplier || !color || !price) {
        return res.status(400).json({
            message: 'id, name, forGender, age1, age2, category, supplier, color and price are required'
        })
    }

    if (age1 < 0 || age2 < age1 || price < 0) {
        return res.status(400).json({
            message: 'Invalid age range or price'
        })
    }

    const gift = await Gift.findById(id).exec()

    if (!gift) {
        return res.status(404).json({
            message: 'The gift was not found'
        })
    }

    gift.name = name
    gift.forGender = forGender
    gift.age1 = age1
    gift.age2 = age2
    gift.category = category
    gift.supplier = supplier
    gift.color = color
    gift.price = price
    gift.image = image
    gift.description = description

    const updatedGift = await gift.save()

    res.json({
        message: `'${updatedGift.name}' updated`,
        gift: updatedGift
    })
}

const deleteGift = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Gift id is required'
        })
    }

    const gift = await Gift.findById(id).exec()

    if (!gift) {
        return res.status(404).json({
            message: 'Gift not found'
        })
    }

    const giftName = gift.name
    const giftId = gift._id

    await gift.deleteOne()

    res.json(`Gift '${giftName}' ID ${giftId} deleted`)
}

module.exports = {
    createNewGift,
    getAllGifts,
    updateGift,
    deleteGift,
    findByIdG
}