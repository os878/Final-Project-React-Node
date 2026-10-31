const express = require("express")
const router = express.Router()
const relationshipController = require("../controllers/relationshipController")

router.get("/", relationshipController.getAllRelationships)
router.put("/", relationshipController.updateRelationship)
router.post("/", relationshipController.createNewRelationship)
router.delete("/delete", relationshipController.deleteRelationship)
router.get("/findByIdR", relationshipController.findByIdR)

module.exports = router