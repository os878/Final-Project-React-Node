const Gift = require("../models/gift");
const Category = require('../models/category');
const Event = require('../models/event');
const Relationship = require('../models/relationship');
const mongoose = require("mongoose");
const matchGifts = require("../services/Giftservices");
const cloudinary = require('cloudinary').v2;
const { GoogleGenAI } = require('@google/genai');

require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// פונקציית עזר להמרת קלט מ-FormData או JSON למערך תקין
const parseToArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];
        // תמיכה במקרה שהפרונטנד שלח JSON.stringify(array)
        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);
                return Array.isArray(parsed) ? parsed.filter(Boolean) : [trimmed];
            } catch {
                return [trimmed];
            }
        }
        return [trimmed];
    }
    return [value];
};

const createNewGift = async (req, res) => {
    const {
        name,
        forGender,
        color,
        description
    } = req.body;

    // תומך גם אם נשלחו בשם ברבים (categories) וגם אם נשלחו בשם ביחיד (category)
    const categoriesArray = parseToArray(req.body.categories || req.body.category);
    const eventsArray = parseToArray(req.body.events || req.body.event);
    const relationshipsArray = parseToArray(req.body.relationships || req.body.relationship);
    const stylesArray = parseToArray(req.body.styles);

    const age1 = req.body.age1 !== undefined && req.body.age1 !== '' ? Number(req.body.age1) : null;
    const age2 = req.body.age2 !== undefined && req.body.age2 !== '' ? Number(req.body.age2) : null;
    const price = req.body.price !== undefined && req.body.price !== '' ? Number(req.body.price) : null;

    const DedicationPersonalization =
        req.body.DedicationPersonalization === 'true' ||
        req.body.DedicationPersonalization === true;

    const file = req.file;

    // בדיקה שנבחרה לפחות קטגוריה, אירוע וקשר אחד
    if (
        !name ||
        !forGender ||
        age1 === null || isNaN(age1) ||
        age2 === null || isNaN(age2) ||
        categoriesArray.length === 0 ||
        eventsArray.length === 0 ||
        relationshipsArray.length === 0 ||
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
            categories: categoriesArray,
            events: eventsArray,
            relationships: relationshipsArray,
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
            .populate('categories')
            .populate('events')
            .populate('relationships');

        return res.status(200).json(gifts || []);
    } catch (error) {
        return res.status(500).json({ message: 'שגיאה בטעינת מתנות הספק', error: error.message });
    }
};
const getAllGifts = async (req, res) => {
    try {
        const gifts = await Gift.find()
            .populate('categories')
            .populate('events')
            .populate('relationships')
            .populate('supplier', 'companyName') // רק שם החברה – בלי טלפון, מייל או סיסמה
            .sort({ _id: -1 })                    // מהחדשה לישנה
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

        // שדות שאסור לעדכן דרך הטופס (מזהה, בעלות על המתנה)
        delete updatedFields.id;
        delete updatedFields._id;
        delete updatedFields.supplier;

        if (age1 !== undefined) updatedFields.age1 = age1;
        if (age2 !== undefined) updatedFields.age2 = age2;
        if (price !== undefined) updatedFields.price = price;

        if (req.body.DedicationPersonalization !== undefined) {
            updatedFields.DedicationPersonalization =
                req.body.DedicationPersonalization === 'true' ||
                req.body.DedicationPersonalization === true;
        }

        if (req.body.styles !== undefined) {
            updatedFields.styles = parseToArray(req.body.styles);
        }

        // עדכון מערכי הקטגוריות, האירועים והקשרים
        if (req.body.categories !== undefined || req.body.category !== undefined) {
            updatedFields.categories = parseToArray(req.body.categories || req.body.category);
            delete updatedFields.category;
        }

        if (req.body.events !== undefined || req.body.event !== undefined) {
            updatedFields.events = parseToArray(req.body.events || req.body.event);
            delete updatedFields.event;
        }

        if (req.body.relationships !== undefined || req.body.relationship !== undefined) {
            updatedFields.relationships = parseToArray(req.body.relationships || req.body.relationship);
            delete updatedFields.relationship;
        }

        Object.assign(gift, updatedFields);

        let updatedGift = await gift.save();

        updatedGift = await updatedGift.populate([
            { path: 'categories' },
            { path: 'events' },
            { path: 'relationships' }
        ]);

        return res.json({
            message: `'${updatedGift.name}' updated`,
            gift: updatedGift
        });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid gift data', error: error.message });
    }
};

const deleteGift = async (req, res) => {
    const id = req.body?.id;

    if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'A valid gift id is required' });
    }

    try {
        const filter = req.user.role === 'Admin'
            ? { _id: id }
            : { _id: id, supplier: req.user._id };

        const gift = await Gift.findOne(filter).exec();

        if (!gift) {
            return res.status(404).json({ message: 'Gift not found' });
        }

        const giftName = gift.name;
        const giftId = gift._id;

        await gift.deleteOne();

        return res.json({ message: `Gift '${giftName}' ID ${giftId} deleted` });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete gift' });
    }
};

const findByIdGift = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Gift id is required' });

    try {
        const gift = await Gift.findById(id)
            .populate('categories')
            .populate('events')
            .populate('relationships')
            // הנתיב פתוח לכולם – רק שם החברה. בלי name (שם המשתמש של הספק), טלפון, מייל או סיסמה
            .populate('supplier', 'companyName');

        if (!gift) return res.status(404).json({ message: 'The gift was not found' });
        return res.json(gift);
    } catch (error) {
        // למשל id בפורמט לא תקין
        return res.status(404).json({ message: 'The gift was not found' });
    }
};

const matchGiftsController = async (req, res) => {
    try {
        const matchingGifts = await matchGifts(req.body);
        return res.json({ gifts: matchingGifts });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to match gifts' });
    }
};

// --- פונקציות ה-AI נשארות ללא שינוי ---
const AI_MODELS = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    process.env.GEMINI_FALLBACK_MODEL,
].filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const aiCache = new Map();
const CACHE_MS = 30 * 60 * 1000;
const CACHE_MAX = 100;

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

// ===== להחליף ב-giftController.js את כל הפונקציה generateWithRetry הקיימת בקוד הזה =====
// (AI_MODELS, sleep, aiCache, INSPIRATIONS_SCHEMA ו-getAiInspirations נשארים כמו שהם)

// כמה זמן מקסימום מחכים לתשובה אחת מ-Gemini לפני שמוותרים עליה
const AI_REQUEST_TIMEOUT_MS = 20 * 1000; // 20 שניות
// כמה זמן מקסימום כל התהליך (כל הניסיונות ביחד), כדי שהלקוח לא יחכה דקות
const AI_TOTAL_DEADLINE_MS = 60 * 1000;  // דקה
// כמה ניסיונות לכל מודל לפני שעוברים למודל הגיבוי
const AI_ATTEMPTS_PER_MODEL = 2;

// מריץ promise, ואם הוא לא הסתיים תוך ms – זורק שגיאת "זמן"
// Promise.race = מי שמסיים ראשון מנצח: התשובה של Gemini או הטיימר
const withTimeout = (promise, ms) => {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
            const error = new Error(`Gemini did not answer within ${ms}ms`);
            error.status = 504; // 504 = Timeout
            reject(error);
        }, ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

// שולח ל-Gemini. אם הוא עמוס (503/429) או לא עונה בזמן (504) – מנסה שוב,
// ואם גם זה לא עובד – עובר למודל הגיבוי. אף פעם לא מחכה יותר מ-AI_TOTAL_DEADLINE_MS.
const generateWithRetry = async (request) => {
    const startedAt = Date.now();
    let lastError;

    for (const model of AI_MODELS) {
        for (let attempt = 0; attempt < AI_ATTEMPTS_PER_MODEL; attempt++) {
            // כמה זמן נשאר מתוך הדקה
            const remaining = AI_TOTAL_DEADLINE_MS - (Date.now() - startedAt);
            if (remaining < 3000) break; // נשאר פחות מ-3 שניות – אין טעם לנסות

            try {
                return await withTimeout(
                    ai.models.generateContent({ ...request, model }),
                    Math.min(AI_REQUEST_TIMEOUT_MS, remaining)
                );
            } catch (error) {
                lastError = error;
                const retryable = [503, 429, 504].includes(error.status);
                if (!retryable) throw error; // שגיאה אחרת (מפתח, שם מודל) – אין טעם לנסות שוב
                console.warn(`Gemini ${error.status === 504 ? 'timeout' : 'busy'} (${model}, attempt ${attempt + 1}), retrying...`);
                await sleep(800 * 2 ** attempt); // 0.8, 1.6 שניות
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

        const cacheKey = JSON.stringify(answers);
        const cached = aiCache.get(cacheKey);
        if (cached && Date.now() - cached.time < CACHE_MS) {
            return res.json({ inspirations: cached.inspirations });
        }

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