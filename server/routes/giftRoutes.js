const express = require("express")
const router = express.Router()
const giftController = require("../controllers/giftController")
const verifyJWT = require("../middleware/verifyJWT")

router.get("/", giftController.getAllGifts)
router.get("/findByIdG", giftController.findByIdG)
router.post("/", verifyJWT, giftController.createNewGift)
router.put("/", verifyJWT, giftController.updateGift)
router.delete("/delete", verifyJWT, giftController.deleteGift)

module.exports = router