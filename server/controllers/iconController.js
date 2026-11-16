// ===== בחירת אייקון לקטגוריה / אירוע / קשר (מנהל בלבד) =====
// פונקציה אחת שמשמשת את שלושת המודלים – כדי לא לכתוב את אותו קוד שלוש פעמים.
// הלקוח שולח { id, icon }. icon ריק = חזרה לאייקון האוטומטי (לפי השם).

// רק אותיות באנגלית, כמו שמות האייקונים בקוד (למשל "menorah", "starOfDavid")
const VALID_ICON = /^[a-zA-Z]{1,30}$/

const makeSetIcon = (Model) => async (req, res) => {
    const { id, icon } = req.body

    if (!id) {
        return res.status(400).json({ message: 'id is required' })
    }
    if (icon && !VALID_ICON.test(icon)) {
        return res.status(400).json({ message: 'Invalid icon name' })
    }

    try {
        const item = await Model.findById(id).exec()
        if (!item) {
            return res.status(404).json({ message: 'The item was not found' })
        }

        item.icon = icon || null
        await item.save()
        return res.json({ _id: item._id, icon: item.icon })
    } catch (error) {
        return res.status(400).json({ message: 'לא ניתן לעדכן את האייקון' })
    }
}

module.exports = { makeSetIcon }
