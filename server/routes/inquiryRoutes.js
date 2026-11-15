const express = require('express');
const router = express.Router();

const {
    createInquiry,
    getSupplierInquiries,
    updateInquiryStatus,
    // חדש:
    getAllInquiries,
    getInquiryStats,
    deleteInquiry
} = require('../controllers/inquiryController');

const { verifyJWT, verifyRole } = require('../middleware/verifyJWT');

// לקוח מחובר יכול ליצור פנייה
router.post('/', verifyJWT, verifyRole('Customer'), createInquiry);

// ספק מחובר יכול לצפות בפניות שהתקבלו אצלו
router.get(
    '/supplier',
    verifyJWT,
    verifyRole('Supplier'),
    getSupplierInquiries
);
// ספק מחובר יכול לעדכן סטטוס של פנייה ששייכת אליו
router.patch(
    '/:id/status',
    verifyJWT,
    verifyRole('Supplier'),
    updateInquiryStatus
);

// ===== חדש: נתיבי מנהל. verifyRole('Admin') = רק מנהל יכול להגיע לכאן =====
// הרגל טוב: נתיב קבוע ('/admin/stats') כותבים לפני נתיב עם פרמטר ('/admin/:id').
// כאן זה לא היה מתנגש כי אחד GET והשני DELETE, אבל אם פעם יהיה GET '/admin/:id',
// Express היה חושב ש-"stats" הוא id של פנייה.
router.get('/admin', verifyJWT, verifyRole('Admin'), getAllInquiries);
router.get('/admin/stats', verifyJWT, verifyRole('Admin'), getInquiryStats);
router.delete('/admin/:id', verifyJWT, verifyRole('Admin'), deleteInquiry);

module.exports = router;