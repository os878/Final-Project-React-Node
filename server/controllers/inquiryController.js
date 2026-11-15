const Inquiry = require('../models/Inquiry');
const Gift = require('../models/gift');

// ===== חדש: אחרי כמה ימים פנייה חדשה שלא טופלה נחשבת "תקועה" =====
// משתנה אחד במקום אחד, כדי שאם תרצי לשנות ל-2 או ל-5 ימים, משנים רק כאן
const STUCK_DAYS = 3;

// יצירת פנייה חדשה
const createInquiry = async (req, res) => {
    try {
        const { giftId, name, phone, email, message, preferredContact } = req.body;

        // בדיקת שדות חובה
        if (!giftId || !name || !phone || !message || !preferredContact) {
            return res.status(400).json({ message: 'יש למלא את כל שדות החובה' });
        }

        // בדיקה שהמתנה קיימת
        const gift = await Gift.findById(giftId);

        if (!gift) {
            return res.status(404).json({ message: 'המתנה לא נמצאה' });
        }

        // יצירת הפנייה
        const inquiry = new Inquiry({
            customer: req.user._id,
            gift: giftId,
            supplier: gift.supplier,
            name,
            phone,
            email,
            message,
            preferredContact
        });

        await inquiry.save();

        res.status(201).json({
            message: 'הפנייה נשלחה בהצלחה',
            inquiry
        });

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה ביצירת הפנייה',
            error: error.message
        });
    }
};

// עדכון סטטוס של פנייה
const updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ['New', 'InProgress', 'Handled'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid inquiry status'
            });
        }

        const inquiry = await Inquiry.findOneAndUpdate(
            {
                _id: req.params.id,
                supplier: req.user._id
            },
            { status },
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return res.status(404).json({
                message: 'Inquiry not found'
            });
        }

        res.status(200).json({
            message: 'Inquiry status updated successfully',
            inquiry
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating inquiry status',
            error: error.message
        });
    }
};

// הצגת הפניות שהתקבלו אצל הספק
const getSupplierInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({
            supplier: req.user._id
        })
            .populate('customer', 'name phone email')
            .populate('gift', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json(inquiries);

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה בטעינת הפניות',
            error: error.message
        });
    }
};

// ===== חדש: מנהל – כל הפניות באתר, מכל הספקים =====
// כמו getSupplierInquiries, רק בלי סינון לפי ספק (find() ריק = הכל),
// ועם populate גם של הספק, כדי שהמנהל יראה לאיזה ספק כל פנייה הגיעה
const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate('customer', 'name')
            .populate('supplier', 'name companyName')
            .populate('gift', 'name image')
            .sort({ createdAt: -1 }); // החדשות ראשונות

        res.status(200).json(inquiries);

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה בטעינת הפניות',
            error: error.message
        });
    }
};

// ===== חדש: מנהל – סיכום מספרים לכרטיסים בראש הדף =====
const getInquiryStats = async (req, res) => {
    try {
        // aggregate = MongoDB עושה את החישוב בעצמו ומחזיר רק את התוצאה.
        // $group מקבץ את כל הפניות לפי שדה status,
        // ו-$sum: 1 מוסיף 1 לכל פנייה בקבוצה = סופר כמה יש מכל סטטוס.
        // התוצאה נראית כך: [ { _id: 'New', count: 4 }, { _id: 'Handled', count: 7 } ]
        const byStatus = await Inquiry.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // התאריך של "לפני 3 ימים": עכשיו פחות 3 ימים במילישניות
        const stuckDate = new Date(Date.now() - STUCK_DAYS * 24 * 60 * 60 * 1000);

        // פניות "תקועות": עדיין New, ונוצרו לפני התאריך הזה ($lt = קטן מ־)
        const stuck = await Inquiry.countDocuments({
            status: 'New',
            createdAt: { $lt: stuckDate }
        });

        // מתחילים מאפסים, כדי שגם סטטוס בלי אף פנייה יופיע עם 0
        const stats = { total: 0, New: 0, InProgress: 0, Handled: 0, stuck, stuckDays: STUCK_DAYS };

        byStatus.forEach((item) => {
            if (['New', 'InProgress', 'Handled'].includes(item._id)) {
                stats[item._id] = item.count;
            }
            stats.total += item.count;
        });

        res.status(200).json(stats);

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה בחישוב נתוני הפניות',
            error: error.message
        });
    }
};

// ===== חדש: מנהל – מחיקת פנייה (למשל פנייה לא רצינית או ספאם) =====
const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: 'הפנייה לא נמצאה' });
        }

        res.status(200).json({ message: 'הפנייה נמחקה' });

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה במחיקת הפנייה',
            error: error.message
        });
    }
};

module.exports = {
    createInquiry,
    getSupplierInquiries,
    updateInquiryStatus,
    // חדש:
    getAllInquiries,
    getInquiryStats,
    deleteInquiry
};