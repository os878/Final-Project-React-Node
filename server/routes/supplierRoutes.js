const express = require("express")
const verifyJWT = require("../middleware/verifyJWT")
const router = express.Router()
const supplierController = require("../controllers/supplierController")
router.get("/",supplierController.getAllSuppliers)
router.put("/",verifyJWT, supplierController.updateSupplier)
router.post("/", supplierController.createNewSupplier)
router.delete("/delete",supplierController.deleteSupplier)//מי יכול למחוק ספק, הוא בעצמו או המנהל?
router.get("/findByIdS",supplierController.findByIdS)//צריך להשתמש בTOKEN?

module.exports = router