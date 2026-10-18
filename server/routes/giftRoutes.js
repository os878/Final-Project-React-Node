const express = require("express")
const router = express.Router()
const giftController = require("../controllers/giftController")

router.get("/", giftController.getAllGifts)
router.get("/findByIdG", giftController.findByIdG)
router.post("/", giftController.createNewGift)
router.put("/", giftController.updateGift)
router.delete("/delete", giftController.deleteGift)

module.exports = router