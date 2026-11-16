const Event = require("../models/event")

const createNewEvent = async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({
            message: 'name is required'
        })
    }

    const event = await Event.create({ name })

    if (event) {
        return res.status(201).json({
            message: 'New Event created'
        })
    } else {
        return res.status(400).json({
            message: 'Invalid Event'
        })
    }
}

const findByIdE = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Event id is required'
        })
    }

    const event = await Event.findById(id)

    if (!event) {
        return res.status(404).json({
            message: 'The event was not found'
        })
    }

    res.json(event)
}

const getAllEvents = async (req, res) => {
    const events = await Event.find().lean()

    if (!events.length) {
        return res.status(404).json({
            message: 'No events found'
        })
    }

    res.json(events)
}

const updateEvent = async (req, res) => {
    const { id, name } = req.body

    if (!id || !name) {
        return res.status(400).json({
            message: 'id and name are required'
        })
    }

    const event = await Event.findById(id).exec()

    if (!event) {
        return res.status(404).json({
            message: 'The event was not found'
        })
    }

    event.name = name

    const updatedEvent = await event.save()

    res.json(`'${updatedEvent.name}' updated`)
}

const deleteEvent = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: 'Event id is required'
        })
    }

    const event = await Event.findById(id).exec()

    if (!event) {
        return res.status(404).json({
            message: 'Event not found'
        })
    }

    const eventName = event.name
    const eventId = event._id

    await event.deleteOne()

    res.json(`Event '${eventName}' ID ${eventId} deleted`)
}

// מנהל: בחירת המתנה שהתמונה שלה מייצגת את האירוע בדף הנחיתה.
// giftId ריק = חזרה לבחירה אוטומטית
const setEventCover = async (req, res) => {
    const { id, giftId } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Event id is required' })
    }

    try {
        const event = await Event.findById(id).exec()
        if (!event) {
            return res.status(404).json({ message: 'The event was not found' })
        }

        event.coverGift = giftId || null
        await event.save()
        return res.json({ _id: event._id, coverGift: event.coverGift })
    } catch (error) {
        return res.status(400).json({ message: 'לא ניתן לעדכן את תמונת האירוע' })
    }
}

module.exports = {
    createNewEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    findByIdE,
    setEventCover
}