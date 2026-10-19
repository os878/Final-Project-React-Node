const express = require("express")
const router = express.Router()
const customerController = require("../controllers/customerController")

router.get("/", customerController.getAllCustomers)
router.put("/", customerController.updateCustomer)
router.post("/", customerController.createNewCustomer)
router.delete("/delete", customerController.deleteCustomer)
router.get("/findByIdC", customerController.findByIdC)

module.exports = router
