const express = require("express")
const { verifyJWT, verifyRole } = require('../middleware/verifyJWT')
const router = express.Router()
const supplierController = require("../controllers/supplierController")

router.get("/",verifyJWT,verifyRole('Admin'),supplierController.getAllSuppliers)
router.put("/",verifyJWT,verifyRole('Supplier','Admin'), supplierController.updateSupplier)
router.delete("/delete",verifyJWT,verifyRole('Supplier','Admin'), supplierController.deleteSupplier)
router.get("/findByIdS",verifyJWT, verifyRole('Supplier'),  supplierController.findByIdS)

module.exports = router