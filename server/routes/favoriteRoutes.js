
const express = require('express');
const router = express.Router();

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require('../controllers/favoriteController');

const { verifyJWT, verifyRole } = require('../middleware/verifyJWT');
// הצגת המתנות האהובות (לספק/מנהל פשוט חוזרת רשימה ריקה)
router.get('/', verifyJWT, getFavorites);

// הוספה והסרה – רק ללקוח. מועדפים הם של לקוחות, לא של ספקים או מנהלים
router.post('/', verifyJWT, verifyRole('Customer'), addFavorite);

router.delete('/:giftId', verifyJWT, verifyRole('Customer'), removeFavorite);

module.exports = router;
