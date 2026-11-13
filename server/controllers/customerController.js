const Customer = require("../models/customer")
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// const createNewCustomer = async (req, res) => {
//     const { name, password, username, email, phone } = req.body
//     if (!name || !password || !username || !email || !phone) { // Confirm data
//         return res.status(400).json({ message: 'name, password, username, email and phone are required' })
//     }
//     const customer = await Customer.create({
//         name, password, username, email, phone
//     })
//     if (customer) { // Created
//         return res.status(201).json({ message: 'New Customer created' })
//     } else {
//         return res.status(400).json({ message: 'Invalid Customer data' })
//     }
// }

const findByIdC = async (req, res) => {
    const id = req.user._id

    const customer = await Customer.findById(id).select('-password')

    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' })
    }

    res.json(customer)
}

const getAllCustomers = async (req, res) => {
    const customers = await Customer.find().select('-password').lean()

    if (!customers?.length) {
        return res.status(400).json({ message: 'No customer found' })
    }
    res.json(customers)
}

// עדכון לקוח
// ===== מייל "פרטי החשבון עודכנו" בעיצוב של Gifter =====
// להדביק את שתי הפונקציות האלה בראש customerController.js (מתחת ל-require-ים):

// מונע מקוד HTML שהוזן בשדות (שם, שם משתמש...) להשתלב בתוך המייל
const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const buildCustomerUpdateEmail = (customer) => {
    const name = escapeHtml(customer.name);
    const username = escapeHtml(customer.username);
    const email = escapeHtml(customer.email);
    const phone = escapeHtml(customer.phone);

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
                                ${row('שם מלא', name)}
                                ${row('שם משתמש', `<span dir="ltr">${username}</span>`)}
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

// ===== customerController.js =====
// להחליף את כל הפונקציה updateCustomer הקיימת בזו:

const updateCustomer = async (req, res) => {
    const { id, name, username, email, phone } = req.body;

    if (!id || !name || !username || !email || !phone) {
        return res.status(400).json({ message: 'id, name, username, email and phone are required' });
    }

    try {
        // מנהל יכול לעדכן כל לקוח, לקוח רגיל יכול לעדכן רק את החשבון של עצמו
        // (תיקון: קודם היה כאן { _id: id, _id: req.user._id } – מפתח כפול)
        const filter = req.user.role === 'Admin'
            ? { _id: id }
            : { _id: req.user._id };

        const customer = await Customer.findOne(filter).exec();

        if (!customer) {
            return res.status(404).json({ message: 'the customer not found' });
        }

        // עדכון השדות
        customer.name = name;
        customer.username = username;
        customer.email = email;
        customer.phone = phone;

        const updatedCustomer = await customer.save();

        // אם העדכון בוצע על ידי מנהל, נשלח מייל עדכון ללקוח
        if (req.user.role === 'Admin') {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev', // ניתן להחליף לכתובת הדומיין המאומת שלך
                    to: updatedCustomer.email,
                    subject: 'פרטי החשבון שלך ב-Gifter עודכנו',
                    html: buildCustomerUpdateEmail(updatedCustomer),
                });
            } catch (emailError) {
                // רישום שגיאה בשליחת המייל מבלי להכשיל את כל פעולת העדכון
                console.error('Error sending email via Resend:', emailError);
            }
        }

        // לא מחזירים את הסיסמה (אם קיימת באובייקט) לדפדפן
        const customerToReturn = updatedCustomer.toObject();
        delete customerToReturn.password;

        return res.json({
            message: `'${updatedCustomer.name}' updated`,
            customer: customerToReturn
        });
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid customer data' });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        return res.status(500).json({ message: 'Unable to update customer' });
    }
};
const deleteCustomer = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Customer id is required' });
    }

    try {
        // מנהל יכול למחוק כל לקוח, משתמש רגיל יכול למחוק רק את החשבון של עצמו
        const filter = req.user.role === 'Admin' 
            ? { _id: id } 
            : { _id: id, _id: req.user._id };

        const customer = await Customer.findOne(filter).exec();

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customerName = customer.name;
        const customerId = customer._id;

        await customer.deleteOne();

        return res.json({
            message: `Customer '${customerName}' ID ${customerId} deleted`,
            id: customerId
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }
        return res.status(500).json({ message: 'Unable to delete customer' });
    }
};

module.exports = {
    // createNewCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
    findByIdC
}