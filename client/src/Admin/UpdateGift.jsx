import React, { useState, useEffect } from 'react'
import Axios from "axios"

export const UpdateGift = ({ gift, onUpdated }) => {

    // שדות בסיסיים
    const [name, setName] = useState("")
    const [gender, setGender] = useState("לא משנה")
    const [age1, setAge1] = useState("")
    const [age2, setAge2] = useState("")
    const [category, setCategory] = useState("")
    const [color, setColor] = useState("")
    const [price, setPrice] = useState("")
    
    // state לקובץ התמונה החדש שנבחר
    const [imageFile, setImageFile] = useState(null)
    const [description, setDescription] = useState("")

    // שדות נוספים מהסכמה
    const [event, setEvent] = useState("")
    const [relationship, setRelationship] = useState("")
    const [dedicationPersonalization, setDedicationPersonalization] = useState(false)
    const [styles, setStyles] = useState([])

    // רשימות נתונים מהשרת
    const [categories, setCategories] = useState([])
    const [events, setEvents] = useState([])
    const [relationships, setRelationships] = useState([])

    const [errorMessage, setErrorMessage] = useState("")

    // אפשרויות סגנון לפי ה-enum בשרת
    const availableStyles = ['שימושי', 'דקורטיבי', 'חווייתי', 'אישי/מרגש', 'יוקרתי', 'מצחיק/מקורית']

    // טעינת הנתונים מהשרת (קטגוריות, אירועים ומערכות יחסים)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, eventRes, relRes] = await Promise.all([
                    Axios.get("http://localhost:7002/api/category"),
                    Axios.get("http://localhost:7002/api/event"),
                    Axios.get("http://localhost:7002/api/relationship")
                ])
                setCategories(catRes.data)
                setEvents(eventRes.data)
                setRelationships(relRes.data)
            } catch (error) {
                setErrorMessage("לא ניתן לטעון את כל הנתונים הדרושים לטופס")
            }
        }
        fetchData()
    }, [])

    // מילוי הטופס כאשר מגיעה מתנה לעריכה
    useEffect(() => {
        if (gift) {
            setName(gift.name || "")
            setGender(gift.forGender || "לא משנה")
            setAge1(gift.age1 ?? "")
            setAge2(gift.age2 ?? "")
            
            const catId = typeof gift.category === 'object' ? gift.category?._id : gift.category
            setCategory(catId || "")
            
            const eventId = typeof gift.event === 'object' ? gift.event?._id : gift.event
            setEvent(eventId || "")

            const relId = typeof gift.relationship === 'object' ? gift.relationship?._id : gift.relationship
            setRelationship(relId || "")

            setColor(gift.color || "")
            setPrice(gift.price ?? "")
            setDescription(gift.description || "")
            setDedicationPersonalization(Boolean(gift.DedicationPersonalization))
            setStyles(gift.styles || [])
            setImageFile(null) // איפוס הקובץ החדש בעת טעינת מתנה לעריכה
        }
    }, [gift])

    const handleInputChange = (setter, value) => {
        setter(value)
        if (errorMessage) setErrorMessage("")
    }

    // טיפול בבחירת סגנונות (מערך של תיבות סימון)
    const handleStyleChange = (style) => {
        if (styles.includes(style)) {
            setStyles(styles.filter(s => s !== style))
        } else {
            setStyles([...styles, style])
        }
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (!name || !category || !event || !relationship) {
            setErrorMessage("יש למלא שם, קטגוריה, אירוע ומערכת יחסים")
            return
        }

        if (age1 !== "" && age2 !== "" && Number(age1) > Number(age2)) {
            setErrorMessage("הגיל המינימלי אינו יכול להיות גדול מהגיל המקסימלי")
            return
        }

        try {
            // בניה של FormData למשלוח הנתונים והקובץ
            const formData = new FormData()
            formData.append("id", gift._id)
            formData.append("name", name)
            formData.append("forGender", gender)
            formData.append("age1", Number(age1))
            formData.append("age2", Number(age2))
            formData.append("category", category)
            formData.append("event", event)
            formData.append("relationship", relationship)
            formData.append("color", color)
            formData.append("price", Number(price))
            formData.append("description", description)
            formData.append("DedicationPersonalization", dedicationPersonalization)

            styles.forEach((style) => {
                formData.append("styles", style)
            })

            // אם נבחרה תמונה חדשה, מוסיפים אותה ל-FormData
            if (imageFile) {
                formData.append("image", imageFile)
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                }
            }

            const { data } = await Axios.put(
                "http://localhost:7002/api/gift",
                formData,
                config
            )

            alert("המתנה עודכנה בהצלחה!")

            if (onUpdated) {
                onUpdated(data.gift || data)
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message)
            } else {
                setErrorMessage("אירעה שגיאה בעת עדכון המתנה")
            }
        }
    }

    return (
        <div>
            <h2>עריכת מתנה</h2>
            <form onSubmit={submitForm}>

                {/* שם המתנה */}
                <label htmlFor="giftName">שם המתנה</label>
                <input
                    id="giftName"
                    type="text"
                    value={name}
                    onChange={(e) => handleInputChange(setName, e.target.value)}
                />

                {/* מגדר */}
                <label htmlFor="gender">מיועד עבור</label>
                <select
                    id="gender"
                    value={gender}
                    onChange={(e) => handleInputChange(setGender, e.target.value)}
                >
                    <option value="בן">בן</option>
                    <option value="בת">בת</option>
                    <option value="לא משנה">לא משנה</option>
                </select>

                {/* גיל מינימלי ומקסימלי */}
                <label htmlFor="age1">גיל מינימלי</label>
                <input
                    id="age1"
                    type="number"
                    min="0"
                    value={age1}
                    onChange={(e) => handleInputChange(setAge1, e.target.value)}
                />

                <label htmlFor="age2">גיל מקסימלי</label>
                <input
                    id="age2"
                    type="number"
                    min="0"
                    value={age2}
                    onChange={(e) => handleInputChange(setAge2, e.target.value)}
                />

                {/* קטגוריה */}
                <label htmlFor="category">קטגוריה</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => handleInputChange(setCategory, e.target.value)}
                >
                    <option value="">בחרי קטגוריה</option>
                    {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* אירוע */}
                <label htmlFor="event">אירוע</label>
                <select
                    id="event"
                    value={event}
                    onChange={(e) => handleInputChange(setEvent, e.target.value)}
                >
                    <option value="">בחרי אירוע</option>
                    {events.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* מערכת יחסים / למי מיועד */}
                <label htmlFor="relationship">למי מיועד</label>
                <select
                    id="relationship"
                    value={relationship}
                    onChange={(e) => handleInputChange(setRelationship, e.target.value)}
                >
                    <option value="">בחרי קשר</option>
                    {relationships.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* צבע */}
                <label htmlFor="color">צבע</label>
                <input
                    id="color"
                    type="text"
                    value={color}
                    onChange={(e) => handleInputChange(setColor, e.target.value)}
                />

                {/* מחיר */}
                <label htmlFor="price">מחיר</label>
                <input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => handleInputChange(setPrice, e.target.value)}
                />

                {/* תמונה - בחירת קובץ */}
                <label htmlFor="image">החלפת תמונה (אופציונלי)</label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            handleInputChange(setImageFile, e.target.files[0])
                        }
                    }}
                />

                {/* תיאור */}
                <label htmlFor="description">תיאור המתנה</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => handleInputChange(setDescription, e.target.value)}
                />

                {/* הקדשה אישית */}
                <div>
                    <label htmlFor="dedication">
                        <input
                            id="dedication"
                            type="checkbox"
                            checked={dedicationPersonalization}
                            onChange={(e) => setDedicationPersonalization(e.target.checked)}
                        />
                        אפשרות להקדשה אישית
                    </label>
                </div>

                {/* סגנונות */}
                <div>
                    <label>סגנונות:</label>
                    {availableStyles.map((style) => (
                        <label key={style} style={{ marginLeft: '10px' }}>
                            <input
                                type="checkbox"
                                checked={styles.includes(style)}
                                onChange={() => handleStyleChange(style)}
                            />
                            {style}
                        </label>
                    ))}
                </div>

                {errorMessage && (
                    <p style={{ color: 'red' }}>
                        {errorMessage}
                    </p>
                )}

                <button type="submit">שמירת שינויים</button>

            </form>
        </div>
    )
}

export default UpdateGift