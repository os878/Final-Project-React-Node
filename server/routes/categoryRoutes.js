const express = require("express")
const router = express.Router()
// התיקון: ייבוא categoryController ולא relationshipController
const categoryController = require("../controllers/categoryController") 
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")

// קריאה פתוחה לכולם (השאלון והקטלוג פתוחים גם לאורח). שינוי – רק למנהל
router.get("/", categoryController.getAllCategories)
router.put("/", verifyJWT, verifyRole('Admin'), categoryController.updateCategory)
router.post("/", verifyJWT, verifyRole('Admin'), categoryController.createNewCategory)
router.delete("/delete", verifyJWT, verifyRole('Admin'), categoryController.deleteCategory)
router.get("/findById", categoryController.findByIdC)

module.exports = router