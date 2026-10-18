
const Category = require("../models/category")

const createNewCategory = async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({
            message: 'name is required'
        })
    }

    const category = await Category.create({ name })

    if (category) {
        return res.status(201).json({
            message: 'New Category created'
        })
    } else {
        return res.status(400).json({
            message: 'Invalid Category'
        })
    }
}

const findByIdC = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Category id is required'
        })
    }

    const category = await Category.findById(id)

    if (!category) {
        return res.status(404).json({
            message: 'The category was not found'
        })
    }

    res.json(category)
}

const getAllCategories = async (req, res) => {
    const categories = await Category.find().lean()

    if (!categories.length) {
        return res.status(404).json({
            message: 'No categories found'
        })
    }

    res.json(categories)
}

const updateCategory = async (req, res) => {
    const { id, name } = req.body

    if (!id || !name) {
        return res.status(400).json({
            message: 'id and name are required'
        })
    }

    const category = await Category.findById(id).exec()

    if (!category) {
        return res.status(404).json({
            message: 'The category was not found'
        })
    }

    category.name = name

    const updatedCategory = await category.save()

    res.json(`'${updatedCategory.name}' updated`)
}

const deleteCategory = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Category id is required'
        })
    }

    const category = await Category.findById(id).exec()

    if (!category) {
        return res.status(404).json({
            message: 'Category not found'
        })
    }

    const categoryName = category.name
    const categoryId = category._id

    await category.deleteOne()

    res.json(`Category '${categoryName}' ID ${categoryId} deleted`)
}

module.exports = {
    createNewCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    findByIdC
}
