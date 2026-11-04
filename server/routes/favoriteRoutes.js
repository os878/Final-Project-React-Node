
const express = require('express');
const router = express.Router();

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require('../controllers/favoriteController');

const { verifyJWT } = require('../middleware/verifyJWT');
// הצגת המתנות האהובות
router.get('/', verifyJWT, getFavorites);

// הוספת מתנה למועדפים
router.post('/', verifyJWT, addFavorite);

// הסרת מתנה מהמועדפים
router.delete('/:giftId', verifyJWT, removeFavorite);

module.exports = router;
