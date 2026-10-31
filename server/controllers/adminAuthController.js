const Admin = require("../models/Admin");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// הרשמת מנהל חדש
const register = async (req, res) => {
    const { name, password, phone, email, username } = req.body;

    if (!name || !password || !phone || !email || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // בדיקת כפילות אימייל
    const duplicateEmail = await Admin.findOne({ email }).lean();
    if (duplicateEmail) {
        return res.status(409).json({ message: "Duplicate email" });
    }

    // בדיקת כפילות שם משתמש
    const duplicateUsername = await Admin.findOne({ username }).lean();
    if (duplicateUsername) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    // הצפנת סיסמה
    const hashedPwd = await bcrypt.hash(password, 10);

    const adminObject = { name, username, password: hashedPwd, phone, email };
    const admin = await Admin.create(adminObject);

    if (admin) {
        return res.status(201).json({
            message: `New admin ${admin.name} created`
        });
    } else {
        return res.status(400).json({ message: 'Invalid admin data received' });
    }
};

// התחברות מנהל
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const foundAdmin = await Admin.findOne({ username }).lean();
    if (!foundAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // אימות סיסמה מוצפנת
    const match = await bcrypt.compare(password, foundAdmin.password);
    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // הגדרת המידע בטוקן כולל role מתאים
    const adminInfo = {
        _id: foundAdmin._id,
        name: foundAdmin.name,
        username: foundAdmin.username,
        email: foundAdmin.email,
        phone: foundAdmin.phone,
        role: 'Admin'
    };

    // הנפקת הטוקן
    const accessToken = jwt.sign(
        adminInfo,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    res.json({ accessToken });
};

module.exports = { register, login };