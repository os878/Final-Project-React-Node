
const Admin = require("../models/Admin")

// יצירת מנהל חדש
const createNewAdmin = async (req, res) => {
    const { name, password, username, email, phone } = req.body

    if (!name || !password || !username || !email || !phone) {
        return res.status(400).json({
            message: 'name, password, username, email and phone are required'
        })
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
        return res.status(201).json({ message: 'New Admin created' })
    } else {
        return res.status(400).json({ message: 'Invalid Admin data' })
    }
}

// חיפוש מנהל לפי ID
const findByIdA = async (req, res) => {
    const id = req.user._id

    if (!id) {
        return res.status(400).json({ message: 'Admin id is required' })
    }

    const admin = await Admin.findById(id).select('-password')

    if (!admin) {
        return res.status(404).json({ message: 'The admin not found' })
    }

    res.json(admin)
}

// קבלת כל המנהלים
const getAllAdmins = async (req, res) => {
    const admins = await Admin.find().select('-password').lean()

    if (!admins?.length) {
        return res.status(400).json({ message: 'No admin found' })
    }

    res.json(admins)
}

// עדכון פרטי מנהל
const updateAdmin = async (req, res) => {
    const { id, name, username, email, phone } = req.body

    if (!id || !name || !username || !email || !phone) {
        return res.status(400).json({
            message: 'id, name, username, email and phone are required'
        })
    }

    const admin = await Admin.findById(id).exec()

    if (!admin) {
        return res.status(400).json({ message: 'The admin not found' })
    }

    admin.name = name
    admin.username = username
    admin.email = email
    admin.phone = phone

    const updatedAdmin = await admin.save()

    res.json(`'${updatedAdmin.name}' updated`)
}

// מחיקת מנהל
const deleteAdmin = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Admin id is required' })
    }

    const admin = await Admin.findById(id).exec()

    if (!admin) {
        return res.status(400).json({ message: 'Admin not found' })
    }

    const adminName = admin.name
    const adminId = admin._id

    await admin.deleteOne()

    const reply = `Admin '${adminName}' ID ${adminId} deleted`

    res.json(reply)
}

module.exports = {
    createNewAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    findByIdA
}
