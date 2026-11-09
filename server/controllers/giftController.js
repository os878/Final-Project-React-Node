const Gift = require("../models/gift");
const Category = require('../models/category');
const Event = require('../models/event');
const Relationship = require('../models/relationship');
const mongoose = require("mongoose");
const matchGifts = require("../services/Giftservices");
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const createNewGift = async (req, res) => {
    const { 
        name, 
        forGender, 
        category, 
        event, 
        relationship, 
        color, 
        description 
    } = req.body;

    const age1 = req.body.age1 !== undefined && req.body.age1 !== '' ? Number(req.body.age1) : null;
    const age2 = req.body.age2 !== undefined && req.body.age2 !== '' ? Number(req.body.age2) : null;
    const price = req.body.price !== undefined && req.body.price !== '' ? Number(req.body.price) : null;
    
    const DedicationPersonalization = 
        req.body.DedicationPersonalization === 'true' || 
        req.body.DedicationPersonalization === true;

    let stylesArray = [];
    if (Array.isArray(req.body.styles)) {
        stylesArray = req.body.styles;
    } else if (req.body.styles) {
        stylesArray = [req.body.styles];
    }

    const file = req.file;

    if (
        !name || 
        !forGender || 
        age1 === null || isNaN(age1) || 
        age2 === null || isNaN(age2) || 
        !category || 
        !event || 
        !relationship || 
        !color || 
        price === null || isNaN(price) ||
        req.body.DedicationPersonalization === undefined
    ) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    if (age1 < 0 || age2 < age1 || price < 0) {
        return res.status(400).json({ message: 'Invalid age range or price' });
    }

    try {
        let imageUrl = '';

        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'gifts' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });

            imageUrl = uploadResult.secure_url;
        }

        const gift = await Gift.create({ 
            name, 
            forGender, 
            age1, 
            age2, 
            category: category && category.trim() !== '' ? category : null, 
            event: event && event.trim() !== '' ? event : null, 
            relationship: relationship && relationship.trim() !== '' ? relationship : null, 
            color, 
            price, 
            image: imageUrl, 
            description, 
            styles: stylesArray, 
            DedicationPersonalization, 
            supplier: req.user._id 
        });

        if (gift) {
            return res.status(201).json({ message: 'New Gift created', gift });
        } else {
            return res.status(400).json({ message: 'Invalid Gift' });
        }
    } catch (error) {
        console.error("Error creating gift:", error);
        return res.status(400).json({ message: 'Error creating gift', error: error.message });
    }
};

const findByIdSupplier = async (req, res) => {
    try {
        const gifts = await Gift.find({ supplier: req.user._id })
            .populate('category')
            .populate('event')
            .populate('relationship');

        return res.status(200).json(gifts || []);
    } catch (error) {
        return res.status(500).json({ message: 'שגיאה בטעינת מתנות הספק', error: error.message });
    }
};

const getAllGifts = async (req, res) => {
    try {
        const gifts = await Gift.find()
            .populate('category')
            .populate('event')
            .populate('relationship')
            .exec();

        return res.status(200).json(gifts);
    } catch (error) {
        return res.status(500).json({ message: 'שגיאה בשרת בעת טעינת המתנות', error: error.message });
    }
};

const updateGift = async (req, res) => {
    const { id } = req.body;
    const file = req.file;

    const age1 = req.body.age1 !== undefined && req.body.age1 !== '' ? Number(req.body.age1) : undefined;
    const age2 = req.body.age2 !== undefined && req.body.age2 !== '' ? Number(req.body.age2) : undefined;
    const price = req.body.price !== undefined && req.body.price !== '' ? Number(req.body.price) : undefined;

    if (
        (age1 !== undefined && (isNaN(age1) || age1 < 0)) ||
        (age2 !== undefined && (isNaN(age2) || age2 < age1)) ||
        (price !== undefined && (isNaN(price) || price < 0))
    ) {
        return res.status(400).json({ message: 'Invalid age range or price' });
    }

    try {
        const filter = req.user.role === 'Admin' 
            ? { _id: id } 
            : { _id: id, supplier: req.user._id };

        const gift = await Gift.findOne(filter).exec();

        if (!gift) {
            return res.status(404).json({ message: 'The gift was not found' });
        }

        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'gifts' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });

            req.body.image = uploadResult.secure_url;
        }

        const updatedFields = { ...req.body };
        if (age1 !== undefined) updatedFields.age1 = age1;
        if (age2 !== undefined) updatedFields.age2 = age2;
        if (price !== undefined) updatedFields.price = price;
        
        if (req.body.DedicationPersonalization !== undefined) {
            updatedFields.DedicationPersonalization = 
                req.body.DedicationPersonalization === 'true' || 
                req.body.DedicationPersonalization === true;
        }

        if (req.body.styles !== undefined) {
            updatedFields.styles = Array.isArray(req.body.styles) 
                ? req.body.styles 
                : [req.body.styles];
        }

        Object.assign(gift, updatedFields);

        let updatedGift = await gift.save();
        
        updatedGift = await updatedGift.populate([
            { path: 'category' },
            { path: 'event' },
            { path: 'relationship' }
        ]);

        return res.json({
            message: `'${updatedGift.name}' updated`,
            gift: updatedGift
        });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid gift data' });
    }
};

const deleteGift = async (req, res) => {
    const id = req.body?.id;

    if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'A valid gift id is required' });
    }

    try {
        const gift = await Gift.findOne({ _id: id, supplier: req.user._id }).exec();

        if (!gift) {
            return res.status(404).json({ message: 'Gift not found' });
        }

        const giftName = gift.name;
        const giftId = gift._id;

        await gift.deleteOne();

        return res.json(`Gift '${giftName}' ID ${giftId} deleted`);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete gift' });
    }
};

const findByIdGift = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Gift id is required' });

    const gift = await Gift.findById(id)
        .populate('category')
        .populate('event')
        .populate('relationship')
        .populate('supplier', 'name companyName');

    if (!gift) return res.status(404).json({ message: 'The gift was not found' });
    res.json(gift);
};

const matchGiftsController = async (req, res) => {
    try {
        const matchingGifts = await matchGifts(req.body);
        return res.json({ gifts: matchingGifts });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to match gifts' });
    }
};

module.exports = {
    createNewGift,
    getAllGifts,
    updateGift,
    deleteGift,
    findByIdSupplier,
    findByIdGift,
    matchGiftsController
};