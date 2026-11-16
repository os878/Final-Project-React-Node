const express = require("express")
const router = express.Router()
const giftController = require("../controllers/giftController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")
const { aiLimiter } = require("../middleware/rateLimit")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ===== פתוח לכולם (גם לאורח): צפייה במתנות וחישוב התאמה =====
// הנתונים כאן לא רגישים: מהספק נשלח רק שם החברה (ראו giftController).
router.get("/findByIdGift/:id", giftController.findByIdGift)
router.get("/getAllGifts", giftController.getAllGifts)
router.get("/featured", giftController.getFeaturedGifts) // מתנות לדף הנחיתה
router.post("/matchGifts", giftController.matchGiftsController)

// ===== דורש התחברות =====
router.get("/findByIdSupplier", verifyJWT, verifyRole('Supplier'), giftController.findByIdSupplier)
router.post("/", verifyJWT, verifyRole('Supplier'), upload.single('image'), giftController.createNewGift)
router.put("/", verifyJWT, verifyRole('Supplier', 'Admin'), upload.single('image'), giftController.updateGift)
router.delete("/delete", verifyJWT, verifyRole('Supplier', 'Admin'), giftController.deleteGift)
// מנהל בוחר אילו מתנות יוצגו בדף הנחיתה
router.patch("/featured/:id", verifyJWT, verifyRole('Admin'), giftController.toggleFeatured)
// השראות AI נשארות ללקוח מחובר בלבד – כל קריאה ל-Gemini עולה כסף
router.post("/getAiInspirations", verifyJWT, verifyRole('Customer'), aiLimiter, giftController.getAiInspirations) // עד 10 ביום למשתמש

module.exports = router