const express = require("express")
const router = express.Router()
const giftController = require("../controllers/giftController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")

router.get("/findByIdSupplier",verifyJWT,verifyRole('Supplier'), giftController.findByIdSupplier)
router.get("/findByIdGift",verifyJWT, giftController.findByIdGift)
router.get("/getAllGifts",verifyJWT,verifyRole('Supplier','Admin'), giftController.getAllGifts)
router.post("/", verifyJWT,verifyRole('Supplier'), giftController.createNewGift)
router.put("/", verifyJWT,verifyRole('Supplier','Admin'), giftController.updateGift)
router.delete("/delete", verifyJWT,verifyRole('Supplier','Admin'), giftController.deleteGift)
router.post("/matchGifts",verifyJWT, verifyRole('Customer'), giftController.matchGiftsController)

module.exports = router