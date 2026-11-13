require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Supplier = require('./models/supplier'); // ודאי שאות קטנה/גדולה תואמת לשם הקובץ אצלך

const MONGO_URI = process.env.DATABASE_URI;

async function resetPasswords() {
    try {
        await mongoose.connect(MONGO_URI);
        
        // יצירת הצפנה חדשה ותקנית עבור הסיסמה 123456
        const newHashedPassword = await bcrypt.hash('123456', 10);
        
        // עדכון כל הספקים בטבלה
        const result = await Supplier.updateMany({}, { $set: { password: newHashedPassword } });
        console.log(`הסיסמה עודכנה בהצלחה ל-123456 עבור ${result.modifiedCount} ספקים.`);
        
    } catch (error) {
        console.error('שגיאה:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetPasswords();