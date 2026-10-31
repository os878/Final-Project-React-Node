const Gift = require('../models/gift')
const mongoose = require('mongoose')

const matchGifts = async (req, res) => {
    const { forGender, age, category, event, relationship, color, price } = req.body

    // בדיקת שדות חובה לפי המודל 
    if (
        !forGender || 
        age == null ||
        !category || 
        !event || 
        !relationship || 
        !color || 
        price == null
    ) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
  

}