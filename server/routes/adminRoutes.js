
const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT");
router.get("/",verifyJWT,verifyRole('Admin'), adminController.getAllAdmins)
router.put("/",verifyJWT,verifyRole('Admin'), adminController.updateAdmin)
router.post("/", verifyJWT, verifyRole('Admin'), adminController.createNewAdmin)
router.delete("/delete",verifyJWT,verifyRole('Admin'), adminController.deleteAdmin)
router.get("/findByIdA",verifyJWT, verifyRole('Admin'), adminController.findByIdA)

module.exports = router
