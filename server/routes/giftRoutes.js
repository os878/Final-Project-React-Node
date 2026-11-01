const express = require("express")
const router = express.Router()
const giftController = require("../controllers/giftController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")
router.get("/", giftController.getAllGifts)

router.get("/findByIdSupplier",verifyJWT,verifyRole('Supplier'), giftController.findByIdSupplier)
router.get("/findByIdGift",verifyJWT, giftController.findByIdGift)
router.post("/", verifyJWT,verifyRole('Supplier'), giftController.createNewGift)
router.put("/", verifyJWT,verifyRole('Supplier'), giftController.updateGift)
router.delete("/delete", verifyJWT,verifyRole('Supplier'), giftController.deleteGift)
router.post("/matchGifts",verifyJWT, verifyRole('Customer'), giftController.matchGiftsController)

module.exports = router