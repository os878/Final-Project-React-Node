const express = require("express")
const router = express.Router()
const eventController = require("../controllers/eventController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")

// קריאה פתוחה לכולם (השאלון והקטלוג פתוחים גם לאורח). שינוי – רק למנהל
router.get("/", eventController.getAllEvents)
router.put("/", verifyJWT,verifyRole('Admin'), eventController.updateEvent)
router.post("/", verifyJWT,verifyRole('Admin'), eventController.createNewEvent)
router.delete("/delete", verifyJWT,verifyRole('Admin'), eventController.deleteEvent)
// מנהל: תמונת האירוע בדף הנחיתה
router.patch("/cover", verifyJWT, verifyRole('Admin'), eventController.setEventCover)
router.get("/findByIdE", eventController.findByIdE)

module.exports = router