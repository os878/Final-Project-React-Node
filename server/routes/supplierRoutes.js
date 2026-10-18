const express = require("express")
const router = express.Router()
const supplierController = require("../controllers/supplierController")
router.get("/",supplierController.getAllSuppliers)
router.put("/", supplierController.updateSupplier)
router.post("/", supplierController.createNewSupplier)
router.delete("/delete",supplierController.deleteSupplier)
router.get("/findByIdS",supplierController.findByIdS)

module.exports = router