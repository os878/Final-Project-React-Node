const express = require("express")
const router = express.Router()
const relationshipController = require("../controllers/relationshipController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")
const { makeSetIcon } = require("../controllers/iconController")
const Relationship = require("../models/relationship")

// קריאה פתוחה לכולם (השאלון פתוח גם לאורח). שינוי – רק למנהל
router.get("/", relationshipController.getAllRelationships)
router.put("/", verifyJWT,verifyRole('Admin'), relationshipController.updateRelationship)
router.post("/", verifyJWT,verifyRole('Admin'), relationshipController.createNewRelationship)
router.delete("/delete", verifyJWT,verifyRole('Admin'), relationshipController.deleteRelationship)
// מנהל: בחירת אייקון מהגלריה
router.patch("/icon", verifyJWT, verifyRole('Admin'), makeSetIcon(Relationship))
router.get("/findById", relationshipController.findByIdR)

module.exports = router