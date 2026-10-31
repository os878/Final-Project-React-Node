
const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")

router.get("/", adminController.getAllAdmins)
router.put("/", adminController.updateAdmin)
router.post("/", adminController.createNewAdmin)
router.delete("/delete", adminController.deleteAdmin)
router.get("/findByIdA", adminController.findByIdA)

module.exports = router
