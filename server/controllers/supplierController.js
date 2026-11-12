const Supplier = require("../models/supplier")
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
   const bcrypt = require('bcrypt')

// יצירת ספק חדש
// const createNewSupplier = async (req, res) => {
//     const { name, password, phone, email, companyName } = req.body

//     // בדיקת שדות חובה לפי המודל החדש
//     if (!name || !password || !phone || !email) {
//         return res.status(400).json({ message: 'name, password, phone and email are required' })
//     }

//     const supplier = await Supplier.create({
//         name,
//         password,
//         phone,
//         email,
//         companyName
//     })

//     if (supplier) {
//         return res.status(201).json({ message: 'New Supplier created', supplier })
//     } else {
//         return res.status(400).json({ message: 'Invalid Supplier data' })
//     }
// }

// מציאת ספק לפי מזהה (מ-req.body או req.params)
const findByIdS = async (req, res) => {
   const id = req.user._id;
    if (!id) {
        return res.status(400).json({ message: 'Supplier id is required' })
    }

    const supplier = await Supplier.findById(id).select('_id name companyName email phone').lean()
    if (!supplier) {
        return res.status(404).json({ message: 'The supplier was not found' })
    }
    res.json(supplier)
}

// קבלת כל הספקים
const getAllSuppliers = async (req, res) => {
    const suppliers = await Supplier.find().select('-password').lean()

    if (!suppliers?.length) {
        return res.status(400).json({ message: 'No suppliers found' })
    }
    res.json(suppliers)
}

// עדכון ספק
// ===== מייל "פרטי החשבון עודכנו" בעיצוב של Gifter =====
// להדביק את שתי הפונקציות האלה בראש supplierController.js (מתחת ל-require-ים),
// ובתוך updateSupplier להחליף את כל ה-html: `...` בשורה אחת:
//     html: buildSupplierUpdateEmail(updatedSupplier),

// מונע מקוד HTML שהוזן בשדות (שם, חברה...) להשתלב בתוך המייל
const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const buildSupplierUpdateEmail = (supplier) => {
    const name = escapeHtml(supplier.name);
    const company = escapeHtml(supplier.companyName) || 'לא צוין';
    const email = escapeHtml(supplier.email);
    const phone = escapeHtml(supplier.phone);

    // שורה בטבלת הפרטים
    const row = (label, value, last = false) => `
        <tr>
            <td style="padding:14px 18px;${last ? '' : 'border-bottom:1px solid #ECE5DA;'}font-size:14px;color:#5C4A40;font-weight:bold;width:38%;">${label}</td>
            <td style="padding:14px 18px;${last ? '' : 'border-bottom:1px solid #ECE5DA;'}font-size:16px;color:#2A1A14;font-weight:bold;">${value}</td>
        </tr>`;

    return `
<!doctype html>
<html lang="he" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>פרטי החשבון שלך עודכנו</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F3ED;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F3ED;">
        <tr>
            <td align="center" style="padding:32px 12px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl"
                    style="max-width:560px;background-color:#FFFFFF;border:1px solid #ECE5DA;border-radius:24px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;">

                    <!-- כותרת עליונה -->
                    <tr>
                        <td style="background-color:#2A1A14;padding:28px 32px;">
                            <div dir="ltr" style="font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:30px;font-weight:bold;color:#FFFFFF;letter-spacing:0;text-align:right;">Gifter</div>
                            <div style="margin-top:6px;font-size:15px;color:#E3D6CC;">
                                מוצאים בקלות, <span style="color:#D9B26A;font-weight:bold;">מעניקים בכיף.</span>
                            </div>
                        </td>
                    </tr>

                    <!-- פס זהב דק -->
                    <tr><td style="height:4px;line-height:4px;font-size:0;background-color:#D9B26A;">&nbsp;</td></tr>

                    <!-- תוכן -->
                    <tr>
                        <td style="padding:32px 32px 8px;">
                            <h1 style="margin:0 0 10px;font-size:24px;line-height:1.3;color:#2A1A14;">שלום ${name},</h1>
                            <p style="margin:0;font-size:16px;line-height:1.7;color:#5C4A40;">
                                רצינו לעדכן שפרטי החשבון שלך ב-Gifter עודכנו על ידי מנהל המערכת.
                                אלה הפרטים כפי שהם שמורים עכשיו:
                            </p>
                        </td>
                    </tr>

                    <!-- טבלת הפרטים -->
                    <tr>
                        <td style="padding:20px 32px 8px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background-color:#FDFCFA;border:1px solid #ECE5DA;border-radius:16px;overflow:hidden;">
                                ${row('שם איש קשר', name)}
                                ${row('שם החברה', company)}
                                ${row('אימייל', `<span dir="ltr">${email}</span>`)}
                                ${row('טלפון', `<span dir="ltr">${phone}</span>`, true)}
                            </table>
                        </td>
                    </tr>

                    <!-- הערה -->
                    <tr>
                        <td style="padding:20px 32px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background-color:#F7EEF0;border-right:4px solid #7A1F2B;border-radius:12px;">
                                <tr>
                                    <td style="padding:14px 18px;font-size:14px;line-height:1.6;color:#5E1620;">
                                        <strong>לא ביקשת את השינוי?</strong><br>
                                        כדאי לפנות אלינו בהקדם, ונבדוק את זה יחד.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- תחתית -->
                    <tr>
                        <td style="padding:20px 32px;border-top:1px solid #ECE5DA;background-color:#FDFCFA;font-size:13px;line-height:1.6;color:#5C4A40;text-align:center;">
                            המייל נשלח אוטומטית ממערכת Gifter, ואין צורך להשיב עליו.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
// ===== supplierController.js =====
// 1. בראש הקובץ, מתחת ל-require-ים הקיימים, להוסיף (אם עוד אין):
//      const bcrypt = require('bcrypt')
//    (בדיוק אותה שורה שיש ב-supplierAuthController.js – אם שם כתוב 'bcryptjs', לכתוב גם כאן 'bcryptjs')
//
// 2. להדביק מתחתיה את שתי הפונקציות escapeHtml ו-buildSupplierUpdateEmail (מהקובץ supplierUpdateEmail.js)
//
// 3. להחליף את כל הפונקציה updateSupplier הקיימת בזו:

const updateSupplier = async (req, res) => {
    const { id, name, phone, email, companyName, password } = req.body;

    if (!id || !name || !phone || !email) {
        return res.status(400).json({ message: 'id, name, phone and email are required' });
    }

    try {
        // מנהל יכול לעדכן כל ספק, ספק רגיל יכול לעדכן רק את החשבון של עצמו
        // (תיקון: קודם היה כאן { _id: id, _id: req.user._id } – מפתח כפול)
        const filter = req.user.role === 'Admin'
            ? { _id: id }
            : { _id: req.user._id };

        const supplier = await Supplier.findOne(filter).exec();

        if (!supplier) {
            return res.status(404).json({ message: 'The supplier was not found' });
        }

        // עדכון השדות
        supplier.name = name;
        supplier.phone = phone;
        supplier.email = email;
        supplier.companyName = companyName;

        // אם נשלחה סיסמה חדשה – שומרים אותה מוצפנת
        // (תיקון: קודם נשמרה כמו שהיא, וההתחברות עם bcrypt.compare הייתה נכשלת)
        if (password) {
            supplier.password = await bcrypt.hash(password, 10);
        }

        const updatedSupplier = await supplier.save();

        // אם העדכון בוצע על ידי מנהל, נשלח מייל עדכון לספק
        if (req.user.role === 'Admin') {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev', // ניתן להחליף לכתובת הדומיין המאומת שלך
                    to: updatedSupplier.email,
                    subject: 'פרטי החשבון שלך ב-Gifter עודכנו',
                    html: buildSupplierUpdateEmail(updatedSupplier),
                });
            } catch (emailError) {
                console.error('Error sending email via Resend:', emailError);
            }
        }

        // לא מחזירים את הסיסמה (גם לא מוצפנת) לדפדפן
        const supplierToReturn = updatedSupplier.toObject();
        delete supplierToReturn.password;

        return res.json({
            message: `'${updatedSupplier.name}' updated successfully`,
            supplier: supplierToReturn
        });
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid supplier data' });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Unable to update supplier' });
    }
}
// מחיקת ספק
const deleteSupplier = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Supplier id is required' })
    }

    const supplier = await Supplier.findById(id).exec()
    if (!supplier) {
        return res.status(400).json({ message: 'Supplier not found' })
    }

    const supplierName = supplier.name
    const supplierId = supplier._id

    await supplier.deleteOne()

    const reply = `Supplier '${supplierName}' ID ${supplierId} deleted`
    res.json(reply)
}

module.exports = {
    // createNewSupplier,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
    findByIdS
}