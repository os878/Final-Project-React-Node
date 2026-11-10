const express = require("express")
const router = express.Router()
const relationshipController = require("../controllers/relationshipController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")

router.get("/",verifyJWT, relationshipController.getAllRelationships)
router.put("/", verifyJWT,verifyRole('Admin'), relationshipController.updateRelationship)
router.post("/", verifyJWT,verifyRole('Admin'), relationshipController.createNewRelationship)
router.delete("/delete", verifyJWT,verifyRole('Admin'), relationshipController.deleteRelationship)
router.get("/findById", verifyJWT,relationshipController.findByIdR)

module.exports = router