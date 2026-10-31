const Relationship = require("../models/relationship")

// יצירת קשר קרבה חדש
const createNewRelationship = async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({
            message: 'name is required'
        })
    }

    const relationship = await Relationship.create({ name })

    if (relationship) {
        return res.status(201).json({
            message: 'New Relationship created'
        })
    } else {
        return res.status(400).json({
            message: 'Invalid Relationship'
        })
    }
}

// שליפת קשר קרבה לפי מזהה
const findByIdR = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Relationship id is required'
        })
    }

    const relationship = await Relationship.findById(id)

    if (!relationship) {
        return res.status(404).json({
            message: 'The relationship was not found'
        })
    }

    res.json(relationship)
}

// שליפת כל קשרי הקרבה
const getAllRelationships = async (req, res) => {
    const relationships = await Relationship.find().lean()

    if (!relationships.length) {
        return res.status(404).json({
            message: 'No relationships found'
        })
    }

    res.json(relationships)
}

// עדכון קשר קרבה
const updateRelationship = async (req, res) => {
    const { id, name } = req.body

    if (!id || !name) {
        return res.status(400).json({
            message: 'id and name are required'
        })
    }

    const relationship = await Relationship.findById(id).exec()

    if (!relationship) {
        return res.status(404).json({
            message: 'The relationship was not found'
        })
    }

    relationship.name = name

    const updatedRelationship = await relationship.save()

    res.json(`'${updatedRelationship.name}' updated`)
}

// מחיקת קשר קרבה
const deleteRelationship = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Relationship id is required'
        })
    }

    const relationship = await Relationship.findById(id).exec()

    if (!relationship) {
        return res.status(404).json({
            message: 'Relationship not found'
        })
    }

    const relationshipName = relationship.name
    const relationshipId = relationship._id

    await relationship.deleteOne()

    res.json(`Relationship '${relationshipName}' ID ${relationshipId} deleted`)
}

module.exports = {
    createNewRelationship,
    getAllRelationships,
    updateRelationship,
    deleteRelationship,
    findByIdR
}