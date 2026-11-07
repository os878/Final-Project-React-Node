const Supplier = require("../models/supplier")
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

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
const updateSupplier = async (req, res) => {
    const { id, name, phone, email, companyName, password } = req.body;

    if (!id || !name || !phone || !email) {
        return res.status(400).json({ message: 'id, name, phone and email are required' });
    }

    try {
        // מנהל יכול לעדכן כל ספק, ספק רגיל יכול לעדכן רק את החשבון של עצמו
        const filter = req.user.role === 'Admin' 
            ? { _id: id } 
            : { _id: id, _id: req.user._id };

        const supplier = await Supplier.findOne(filter).exec();

        if (!supplier) {
            return res.status(404).json({ message: 'The supplier was not found' });
        }

        // עדכון השדות
        supplier.name = name;
        supplier.phone = phone;
        supplier.email = email;
        supplier.companyName = companyName;

        // אם נשלחה סיסמה חדשה, נעדכן אותה
        if (password) {
            supplier.password = password;
        }

        const updatedSupplier = await supplier.save();

        // אם העדכון בוצע על ידי מנהל, נשלח מייל עדכון לספק
        if (req.user.role === 'Admin') {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev', // ניתן להחליף לכתובת הדומיין המאומת שלך
                    to: updatedSupplier.email,
                    subject: 'עדכון פרטי החשבון שלך במערכת',
                    html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">שלום ${updatedSupplier.name},</h2>
                    <p style="font-size: 16px; line-height: 1.5;">פרטי החשבון שלך עודכנו בהצלחה במערכת על ידי מנהל.</p>
                    
                    <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 15px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #34495e; border-bottom: 1px solid #eee; padding-bottom: 8px;">הפרטים המעודכנים:</h3>
                        <ul style="list-style-type: none; padding-right: 0; margin: 0; line-height: 1.8;">
                            <li><strong>שם איש קשר:</strong> ${updatedSupplier.name}</li>
                            <li><strong>שם חברה:</strong> ${updatedSupplier.companyName || 'לא צוין'}</li>
                            <li><strong>אימייל:</strong> ${updatedSupplier.email}</li>
                            <li><strong>טלפון:</strong> ${updatedSupplier.phone}</li>
                        </ul>
                    </div>

                    <p style="font-size: 14px; color: #7f8c8d;">אם לא ביקשת שינוי זה, אנא פנה לתמיכה בהקדם.</p>
                </div>
            `
                });
            } catch (emailError) {
                console.error('Error sending email via Resend:', emailError);
            }
        }

        return res.json({
            message: `'${updatedSupplier.name}' updated successfully`,
            supplier: updatedSupplier
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