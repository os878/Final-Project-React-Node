const express = require("express")
const router = express.Router()
const { verifyJWT } = require("../middleware/verifyJWT")

// מחזיר לאתר מי המשתמש המחובר.
// verifyJWT בודק את ה-token עם המפתח הסודי, ולכן אי אפשר לזייף את התשובה מהדפדפן.
// בטוקן ה-role כתוב באות גדולה ('Customer' / 'Supplier' / 'Admin'),
// והאתר עובד באותיות קטנות ('customer' / 'supplier' / 'admin'), לכן toLowerCase.
router.get("/me", verifyJWT, (req, res) => {
    res.json({ role: req.user.role.toLowerCase() })
})

module.exports = router