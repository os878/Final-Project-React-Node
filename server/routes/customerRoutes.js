const express = require("express")
const router = express.Router()
const customerController = require("../controllers/customerController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT");

router.get("/",verifyJWT,verifyRole('Admin'), customerController.getAllCustomers)
router.put("/",verifyJWT,verifyRole('Customer'), customerController.updateCustomer)
router.delete("/delete",verifyJWT,verifyRole('Customer'), customerController.deleteCustomer)
router.get("/findByIdC",verifyJWT, verifyRole('Customer'), customerController.findByIdC)

module.exports = router
