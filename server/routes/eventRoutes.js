const express = require("express")
const router = express.Router()
const eventController = require("../controllers/eventController")

router.get("/", eventController.getAllEvents)
router.put("/", eventController.updateEvent)
router.post("/", eventController.createNewEvent)
router.delete("/delete", eventController.deleteEvent)
router.get("/findByIdE", eventController.findByIdE)

module.exports = router