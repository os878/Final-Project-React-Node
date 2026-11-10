const express = require("express")
const router = express.Router()
const eventController = require("../controllers/eventController")
const { verifyJWT, verifyRole } = require("../middleware/verifyJWT")

router.get("/",verifyJWT, eventController.getAllEvents)
router.put("/", verifyJWT,verifyRole('Admin'), eventController.updateEvent)
router.post("/", verifyJWT,verifyRole('Admin'), eventController.createNewEvent)
router.delete("/delete", verifyJWT,verifyRole('Admin'), eventController.deleteEvent)
router.get("/findByIdE", verifyJWT, eventController.findByIdE)

module.exports = router