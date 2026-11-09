const express = require("express")
const router = express.Router()
const giftController = require("../controllers/giftController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")
// const multer = require('multer')

// const upload = multer({ storage: multer.memoryStorage() })
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/findByIdSupplier",verifyJWT,verifyRole('Supplier'), giftController.findByIdSupplier)
router.get("/findByIdGift",verifyJWT, giftController.findByIdGift)
router.get("/getAllGifts",verifyJWT,verifyRole('Supplier','Admin'), giftController.getAllGifts)
router.post("/", verifyJWT,verifyRole('Supplier'),upload.single('image'), giftController.createNewGift)
router.put("/", verifyJWT,verifyRole('Supplier','Admin'),upload.single('image'), giftController.updateGift)
router.delete("/delete", verifyJWT,verifyRole('Supplier','Admin'), giftController.deleteGift)
router.post("/matchGifts",verifyJWT, verifyRole('Customer'), giftController.matchGiftsController)
router.post("/getAiInspirations",verifyJWT, verifyRole('Customer'), giftController.getAiInspirations)

module.exports = router