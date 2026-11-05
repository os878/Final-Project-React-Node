
const Favorite = require('../models/Favorites');
const Gift = require('../models/gift');

// הוספת מתנה למועדפים
const addFavorite = async (req, res) => {
    try {
        const { giftId } = req.body;
        const customerId = req.user._id;

        // בדיקה שהתקבל מזהה מתנה
        if (!giftId) {
            return res.status(400).json({
                message: 'יש לשלוח מזהה מתנה'
            });
        }

        // בדיקה שהמתנה קיימת
        const gift = await Gift.findById(giftId);

        if (!gift) {
            return res.status(404).json({
                message: 'המתנה לא נמצאה'
            });
        }

        // בדיקה שהמתנה לא נמצאת כבר במועדפים
        const existingFavorite = await Favorite.findOne({
            customer: customerId,
            gift: giftId
        });

        if (existingFavorite) {
            return res.status(409).json({
                message: 'המתנה כבר נמצאת במועדפים'
            });
        }

        // יצירת מועדף חדש
        const favorite = await Favorite.create({
            customer: customerId,
            gift: giftId
        });

        res.status(201).json({
            message: 'המתנה נוספה למועדפים',
            favorite
        });

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה בהוספת המתנה למועדפים',
            error: error.message
        });
    }
};


// הצגת המתנות האהובות של הלקוח המחובר
const getFavorites = async (req, res) => {
    try {
        const customerId = req.user._id;

        const favorites = await Favorite.find({
            customer: customerId
        }).populate('gift');

        res.status(200).json(favorites);

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה בשליפת המתנות האהובות',
            error: error.message
        });
    }
};


// הסרת מתנה מהמועדפים
const removeFavorite = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { giftId } = req.params;

        const favorite = await Favorite.findOneAndDelete({
            customer: customerId,
            gift: giftId
        });

        if (!favorite) {
            return res.status(404).json({
                message: 'המתנה לא נמצאה במועדפים'
            });
        }

        res.status(200).json({
            message: 'המתנה הוסרה מהמועדפים'
        });

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה בהסרת המתנה מהמועדפים',
            error: error.message
        });
    }
};


module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
};
