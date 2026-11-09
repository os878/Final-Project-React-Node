const express = require('express');
const router = express.Router();

const {
    createInquiry,
    getSupplierInquiries,
    updateInquiryStatus
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
module.exports = router;