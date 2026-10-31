const express = require("express")
const router = express.Router()
const giftController = require("../controllers/giftController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")
router.get("/", giftController.getAllGifts)

router.get("/findByIdSupplier",verifyJWT,verifyRole('Supplier'), giftController.findByIdSupplier)
router.get("/findByIdGift",verifyJWT, giftController.findByIdGift)
router.post("/", verifyJWT, giftController.createNewGift)
router.put("/", verifyJWT, giftController.updateGift)
router.delete("/delete", verifyJWT, giftController.deleteGift)

module.exports = router