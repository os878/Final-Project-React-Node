const express = require("express")
const router = express.Router()
const authController = require("../controllers/adminAuthController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")
const { loginLimiter } = require("../middleware/rateLimit")
// הגבלת ניסיונות – מגן מפני ניחוש סיסמאות
router.post("/login", loginLimiter, authController.login)
// רק מנהל מחובר יכול להוסיף מנהל חדש (קודם הנתיב היה פתוח לכל אחד)
router.post("/register", verifyJWT, verifyRole('Admin'), authController.register)
module.exports = router