const Inquiry = require('../models/Inquiry');
const Gift = require('../models/gift');

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


module.exports = {
    createInquiry,
    getSupplierInquiries,
    updateInquiryStatus
};