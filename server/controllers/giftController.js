const Gift = require("../models/gift");
const Category = require('../models/category');
const Event = require('../models/event');
const Relationship = require('../models/relationship');
const mongoose = require("mongoose");
const matchGifts = require("../services/Giftservices");
const cloudinary = require('cloudinary').v2;
const { GoogleGenAI } = require('@google/genai');

require('dotenv').config();

// אתחול Google Gen AI עם ה-API Key שמוגדר בקובץ .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

// פונקציה חדשה ליצירת השראות מבינה מלאכותית
// ===== להחליף את הפונקציה getAiInspirations הקיימת ב-giftController.js בכל הקוד הזה =====
// (ה-ai שכבר מוגדר למעלה בקובץ נשאר כמו שהוא)

// מודל ראשי + מודל גיבוי (שניהם מוגדרים ב-.env, ואפשר להשאיר את הגיבוי ריק)
const AI_MODELS = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    process.env.GEMINI_FALLBACK_MODEL,
].filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// זיכרון קצר: אותן תשובות בשאלון → תשובה מיידית, בלי לפנות שוב ל-Gemini
const aiCache = new Map();
const CACHE_MS = 30 * 60 * 1000; // 30 דקות
const CACHE_MAX = 100;

// מבנה התשובה שאנחנו מצפים לקבל – Gemini מחזיר בדיוק את זה, בלי טקסט מיותר
const INSPIRATIONS_SCHEMA = {
    type: 'ARRAY',
    items: {
        type: 'OBJECT',
        properties: {
            title: { type: 'STRING' },
            description: { type: 'STRING' },
            estimatedPrice: { type: 'STRING' },
        },
        required: ['title', 'description', 'estimatedPrice'],
    },
};

// שולח ל-Gemini, ואם הוא עמוס (503/429) – מנסה שוב, ואז עובר למודל הגיבוי
const generateWithRetry = async (request) => {
    let lastError;
    for (const model of AI_MODELS) {
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                return await ai.models.generateContent({ ...request, model });
            } catch (error) {
                lastError = error;
                const busy = error.status === 503 || error.status === 429;
                if (!busy) throw error;                 // שגיאה אחרת – אין טעם לנסות שוב
                console.warn(`Gemini busy (${model}, attempt ${attempt + 1}), retrying...`);
                await sleep(800 * 2 ** attempt);        // 0.8, 1.6, 3.2 שניות
            }
        }
    }
    const busyError = new Error('השירות עמוס כרגע, נסו שוב בעוד דקה');
    busyError.status = 503;
    busyError.cause = lastError;
    throw busyError;
};

const getAiInspirations = async (req, res) => {
    try {
        const formData = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing in environment variables.");
            return res.status(500).json({ message: 'מפתח API לא מוגדר בשרת' });
        }

        // השאלון שולח גם את השמות (eventName וכו'). אם לא – משתמשים במה שיש.
        const answers = {
            age: formData.age || 'לא צוין',
            gender: formData.forGender || 'לא צוין',
            event: formData.eventName || formData.event || 'לא צוין',
            relationship: formData.relationshipName || formData.relationship || 'לא צוין',
            category: formData.categoryName || formData.category || 'לא צוין',
            styles: Array.isArray(formData.styles) && formData.styles.length ? formData.styles.join(', ') : 'לא צוין',
            price: formData.price ? `${formData.price} ש"ח` : 'לא צוין',
            color: formData.color || 'לא צוין',
            personal: formData.DedicationPersonalization ? 'כן' : 'לא חובה',
        };

        // תשובה מהזיכרון, אם כבר שאלו בדיוק את אותו דבר לאחרונה
        const cacheKey = JSON.stringify(answers);
        const cached = aiCache.get(cacheKey);
        if (cached && Date.now() - cached.time < CACHE_MS) {
            return res.json({ inspirations: cached.inspirations });
        }

        // פרומפט קצר וממוקד = תשובה מהירה יותר
        const prompt = `אתה עוזר יצירתי לבחירת מתנות. פרטי מקבל המתנה:
גיל: ${answers.age}
מגדר: ${answers.gender}
אירוע: ${answers.event}
קשר לנותן: ${answers.relationship}
תחום: ${answers.category}
סגנון: ${answers.styles}
תקציב מקסימלי: ${answers.price}
צבע מועדף: ${answers.color}
אפשרות הקדשה/התאמה אישית: ${answers.personal}

החזר בדיוק 3 רעיונות מקוריים למתנה, בעברית.
לכל רעיון: title (שם קצר), description (עד 2 משפטים: מה זה ולמה זה מתאים), estimatedPrice (מחיר משוער בש"ח, בתוך התקציב).`;

        const response = await generateWithRetry({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: INSPIRATIONS_SCHEMA,
                temperature: 0.9,
            },
        });

        let cleanText = response.text ? response.text.trim() : '';
        if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const inspirations = JSON.parse(cleanText);

        // שמירה בזיכרון (ומחיקת הישן ביותר כשמתמלא)
        if (aiCache.size >= CACHE_MAX) aiCache.delete(aiCache.keys().next().value);
        aiCache.set(cacheKey, { inspirations, time: Date.now() });

        return res.json({ inspirations });
    } catch (error) {
        console.error("Error generating AI inspirations:", error.cause || error);
        if (error.status === 503) {
            return res.status(503).json({ message: 'השירות עמוס כרגע, נסו שוב בעוד דקה' });
        }
        return res.status(500).json({ message: 'לא ניתן ליצור הצעות השראה כרגע', error: error.message });
    }
};
module.exports = {
    createNewGift,
    getAllGifts,
    updateGift,
    deleteGift,
    findByIdSupplier,
    findByIdGift,
    matchGiftsController,
    getAiInspirations
};