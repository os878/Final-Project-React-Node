
import React, { useState, useEffect } from 'react'
import Axios from "axios"

export const AddGift = ({ gift, onUpdated }) => {

    // משתנים לשמירת פרטי המתנה שהמשתמש מכניס
    const [name, setName] = useState("")
    const [gender, setGender] = useState("לא משנה")
    const [age1, setAge1] = useState("")
    const [age2, setAge2] = useState("")
    const [category, setCategory] = useState("")
    const [event, setEvent] = useState("")
    const [relationship, setRelationship] = useState("")
    const [styles, setStyles] = useState([])
    const [dedicationPersonalization, setDedicationPersonalization] = useState(false)
    const [color, setColor] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")

    // משתנה לשמירת רשימת הקטגוריות שמתקבלת מהשרת
    const [categories, setCategories] = useState([])
    const [events, setEvents] = useState([])
    const [relationships, setRelationships] = useState([])

    // משתנה לשמירת הודעת שגיאה
    const [errorMessage, setErrorMessage] = useState("")

    // טעינת הקטגוריות מהשרת כשהקומפוננטה נפתחת
    useEffect(() => {

        // טעינת כל האפשרויות לשדות המקושרים למודלים אחרים
        const getGiftOptions = async () => {
            try {
                const [categoryResponse, eventResponse, relationshipResponse] = await Promise.all([
                    Axios.get("http://localhost:7002/api/category"),
                    Axios.get("http://localhost:7002/api/event"),
                    Axios.get("http://localhost:7002/api/relationship")
                ])

                setCategories(categoryResponse.data)
                setEvents(eventResponse.data)
                setRelationships(relationshipResponse.data)
            } catch (error) {
                console.error("לא ניתן לטעון את אפשרויות המתנה:", error)
                setErrorMessage("לא ניתן לטעון קטגוריות, אירועים וקשרים. נסו לרענן את הדף.")
            }
        }

        getGiftOptions()

    }, []) // המערך הריק גורם להפעלה בעת טעינת הקומפוננטה
    // מילוי הטופס בפרטי המתנה במצב עריכה
    useEffect(() => {
        if (gift) {
            setName(gift.name || "")
            setGender(gift.forGender || "לא משנה")
            setAge1(gift.age1 ?? "")
            setAge2(gift.age2 ?? "")
            setCategory(gift.category?._id || gift.category || "")
            setEvent(gift.event?._id || gift.event || "")
            setRelationship(gift.relationship?._id || gift.relationship || "")
            setStyles(gift.styles || [])
            setDedicationPersonalization(gift.DedicationPersonalization ?? false)
            setColor(gift.color || "")
            setPrice(gift.price ?? "")
            setImage(gift.image || "")
            setDescription(gift.description || "")
        }
    }, [gift])
    // פונקציה לעדכון שדה בטופס ולניקוי הודעת השגיאה
    const handleInputChange = (setter, value) => {

        // עדכון הערך של השדה המתאים
        setter(value)

        // ניקוי הודעת השגיאה כאשר המשתמש מתקן את הנתונים
        if (errorMessage) {
            setErrorMessage("")
        }
    }

    // פונקציה לשליחת פרטי המתנה לשרת
    const submitForm = async (e) => {

        // מניעת רענון אוטומטי של הדף בעת שליחת הטופס
        e.preventDefault()

        // איפוס הודעת שגיאה קודמת
        setErrorMessage("")

        // בדיקה שהשדות הנדרשים מולאו
        if (
            !name.trim() ||
            !category ||
            !event ||
            !relationship ||
            age1 === "" ||
            age2 === "" ||
            price === "" ||
            !color.trim()
        ) {
            setErrorMessage("יש למלא שם, מגדר, גילאים, קטגוריה, אירוע, קשר, צבע ומחיר")
            return
        }

        if (
            !Number.isFinite(Number(age1)) ||
            !Number.isFinite(Number(age2)) ||
            !Number.isFinite(Number(price)) ||
            Number(age1) < 0 ||
            Number(age2) < Number(age1) ||
            Number(price) < 0
        ) {
            setErrorMessage("יש להזין גילאים ומחיר תקינים; הגיל והמחיר אינם יכולים להיות שליליים")
            return
        }
        const token = localStorage.getItem("token")
        if (!token) {
            setErrorMessage("יש להתחבר למערכת כדי להוסיף או לערוך מתנה")
            return
        }
        try {

            // הנתונים שנשלחים לשרת, גם ביצירה וגם בעריכה
            const giftData = {
                name,
                forGender: gender,
                age1: Number(age1),
                age2: Number(age2),
                category,
                event,
                relationship,
                styles,
                DedicationPersonalization: dedicationPersonalization,
                color,
                price: Number(price),
                image,
                description
            }

            // הגדרות האימות מול השרת
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }

            config.headers.Authorization = 'Bearer ' + token

            if (gift) {
                // עדכון מתנה קיימת
                const { data } = await Axios.put(
                    "http://localhost:7002/api/gift",
                    {
                        ...giftData,
                        id: gift._id
                    },
                    config
                )

                alert("המתנה עודכנה בהצלחה!")

                // מעבירים את המתנה המעודכנת ל-GiftsList
                if (onUpdated) {
                    onUpdated(data.gift)
                }
            } else {
                // יצירת מתנה חדשה
                await Axios.post(
                    "http://localhost:7002/api/gift",
                    giftData,
                    config
                )

                alert("המתנה נוספה בהצלחה!")

                // ניקוי השדות לאחר יצירה מוצלחת
                setName("")
                setGender("לא משנה")
                setAge1("")
                setAge2("")
                setCategory("")
                setEvent("")
                setRelationship("")
                setStyles([])
                setDedicationPersonalization(false)
                setColor("")
                setPrice("")
                setImage("")
                setDescription("")
            }


        } catch (error) {

            // הצגת הודעת השגיאה שהתקבלה מהשרת, אם קיימת
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setErrorMessage(error.response.data.message)
            } else {
                // הודעה כללית במקרה של תקלה
                setErrorMessage("אירעה שגיאה בעת הוספת המתנה")
            }
        }
    }

    return (
        <div>
            <h2>{gift ? "עריכת מתנה" : "הוספת מתנה חדשה"}</h2>
            {/* טופס הוספת המתנה */}
            <form onSubmit={submitForm}>

                {/* שם המתנה */}
                <label htmlFor="giftName">שם המתנה</label>
                <input
                    id="giftName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) =>
                        handleInputChange(setName, e.target.value)
                    }
                />

                {/* בחירת המגדר שעבורו המתנה מיועדת */}
                <label htmlFor="gender">מיועד עבור</label>
                <select
                    id="gender"
                    required
                    value={gender}
                    onChange={(e) =>
                        handleInputChange(setGender, e.target.value)
                    }
                >
                    <option value="בן">בן</option>
                    <option value="בת">בת</option>
                    <option value="לא משנה">לא משנה</option>
                </select>

                {/* גיל מינימלי */}
                <label htmlFor="age1">גיל מינימלי</label>
                <input
                    id="age1"
                    type="number"
                    min="0"
                    required
                    value={age1}
                    onChange={(e) =>
                        handleInputChange(setAge1, e.target.value)
                    }
                />

                {/* גיל מקסימלי */}
                <label htmlFor="age2">גיל מקסימלי</label>
                <input
                    id="age2"
                    type="number"
                    min="0"
                    required
                    value={age2}
                    onChange={(e) =>
                        handleInputChange(setAge2, e.target.value)
                    }
                />

                {/* בחירת קטגוריה מתוך הקטגוריות הקיימות במסד הנתונים */}
                <label htmlFor="category">קטגוריה</label>
                <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) =>
                        handleInputChange(setCategory, e.target.value)
                    }
                >
                    <option value="">בחרי קטגוריה</option>

                    {/* מעבר על רשימת הקטגוריות ויצירת אפשרות לכל קטגוריה */}
                    {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* בחירת אירוע מתוך האירועים הקיימים במסד הנתונים */}
                <label htmlFor="event">אירוע</label>
                <select
                    id="event"
                    required
                    value={event}
                    onChange={(e) =>
                        handleInputChange(setEvent, e.target.value)
                    }
                >
                    <option value="">בחרי אירוע</option>
                    {events.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* בחירת קשר מתוך הקשרים הקיימים במסד הנתונים */}
                <label htmlFor="relationship">קשר / קרבה</label>
                <select
                    id="relationship"
                    required
                    value={relationship}
                    onChange={(e) =>
                        handleInputChange(setRelationship, e.target.value)
                    }
                >
                    <option value="">בחרי קשר</option>
                    {relationships.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* סגנונות המתנה */}
                <fieldset>
                    <legend>סגנון המתנה (ניתן לבחור כמה)</legend>
                    {['שימושי', 'דקורטיבי', 'חווייתי', 'אישי/מרגש', 'יוקרתי', 'מצחיק/מקורית'].map((style) => (
                        <label key={style} style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                value={style}
                                checked={styles.includes(style)}
                                onChange={(e) => {
                                    const nextStyles = e.target.checked
                                        ? [...styles, style]
                                        : styles.filter((selectedStyle) => selectedStyle !== style)
                                    handleInputChange(setStyles, nextStyles)
                                }}
                            />
                            {style}
                        </label>
                    ))}
                </fieldset>

                {/* אפשרות להקדשה או התאמה אישית */}
                <label htmlFor="dedicationPersonalization">
                    <input
                        id="dedicationPersonalization"
                        type="checkbox"
                        checked={dedicationPersonalization}
                        onChange={(e) =>
                            handleInputChange(setDedicationPersonalization, e.target.checked)
                        }
                    />
                    ניתן להוסיף הקדשה / התאמה אישית
                </label>

                {/* צבע המתנה */}
                <label htmlFor="color">צבע</label>
                <input
                    id="color"
                    type="text"
                    required
                    value={color}
                    onChange={(e) =>
                        handleInputChange(setColor, e.target.value)
                    }
                />

                {/* מחיר המתנה */}
                <label htmlFor="price">מחיר</label>
                <input
                    id="price"
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) =>
                        handleInputChange(setPrice, e.target.value)
                    }
                />

                {/* קישור לתמונת המתנה */}
                <label htmlFor="image">קישור לתמונה</label>
                <input
                    id="image"
                    type="text"
                    value={image}
                    onChange={(e) =>
                        handleInputChange(setImage, e.target.value)
                    }
                />

                {/* תיאור המתנה */}
                <label htmlFor="description">תיאור המתנה</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) =>
                        handleInputChange(setDescription, e.target.value)
                    }
                />

                {/* הצגת הודעת שגיאה אם קיימת */}
                {errorMessage && (
                    <p style={{ color: 'red' }}>
                        {errorMessage}
                    </p>
                )}

                <button type="submit">
                    {gift ? "שמירת שינויים" : "הוספת מתנה"}
                </button>

            </form>
        </div>
    )
}

export default AddGift
