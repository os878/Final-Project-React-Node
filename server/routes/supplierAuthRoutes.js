const express = require("express")
const router = express.Router()
const authController = require("../controllers/supplierAuthController")
// הגבלת ניסיונות – מגן מפני ניחוש סיסמאות והרשמות המוניות
const { loginLimiter, registerLimiter } = require("../middleware/rateLimit")
router.post("/login", loginLimiter, authController.login)
router.post("/register", registerLimiter, authController.register)
module.exports = router