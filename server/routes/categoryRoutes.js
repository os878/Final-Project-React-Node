
const express = require("express")
const router = express.Router()
const categoryController = require("../controllers/categoryController")

router.get("/", categoryController.getAllCategories)
router.put("/", categoryController.updateCategory)
router.post("/", categoryController.createNewCategory)
router.delete("/delete", categoryController.deleteCategory)
router.get("/findByIdC", categoryController.findByIdC)

module.exports = router
