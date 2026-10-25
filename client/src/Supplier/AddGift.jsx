
import React, { useState, useEffect } from 'react'
import Axios from "axios"

export const AddGift = ({ gift, onUpdated }) => {

    // משתנים לשמירת פרטי המתנה שהמשתמש מכניס
    const [name, setName] = useState("")
    const [gender, setGender] = useState("לא משנה")
    const [age1, setAge1] = useState("")
    const [age2, setAge2] = useState("")
    const [category, setCategory] = useState("")
    const [color, setColor] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")

    // משתנה לשמירת רשימת הקטגוריות שמתקבלת מהשרת
    const [categories, setCategories] = useState([])

    // משתנה לשמירת הודעת שגיאה
    const [errorMessage, setErrorMessage] = useState("")

    // טעינת הקטגוריות מהשרת כשהקומפוננטה נפתחת
    useEffect(() => {

        // פונקציה לקבלת הקטגוריות מהשרת
        const getCategories = async () => {
            try {
                const { data } = await Axios.get(
                    "http://localhost:7002/api/category"
                )

                // שמירת רשימת הקטגוריות שהתקבלה
                setCategories(data)

            } catch (error) {
                // הצגת הודעת שגיאה אם לא הצלחנו לקבל קטגוריות
                setErrorMessage("לא ניתן לטעון את הקטגוריות")
            }
        }

        getCategories()

    }, []) // המערך הריק גורם להפעלה בעת טעינת הקומפוננטה
    // מילוי הטופס בפרטי המתנה במצב עריכה
    useEffect(() => {
        if (gift) {
            setName(gift.name || "")
            setGender(gift.forGender || "לא משנה")
            setAge1(gift.age1 ?? "")
            setAge2(gift.age2 ?? "")
            setCategory(gift.category?._id || gift.category || "")
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
        if (!name || !category || price === "") {
            setErrorMessage("יש למלא שם, קטגוריה ומחיר")
            return
        }

        // בדיקה שהמחיר אינו שלילי
        if (Number(price) < 0) {
            setErrorMessage("המחיר אינו יכול להיות שלילי")
            return
        }

        // בדיקה שהגיל המינימלי אינו גדול מהגיל המקסימלי
        if (
            age1 !== "" &&
            age2 !== "" &&
            Number(age1) > Number(age2)
        ) {
            setErrorMessage(
                "הגיל המינימלי אינו יכול להיות גדול מהגיל המקסימלי"
            )
            return
        }
        // בדיקה ששדות הגיל והצבע מולאו
        if (
            age1 === "" ||
            age2 === "" ||
            !color.trim()
        ) {
            setErrorMessage("יש למלא גיל מינימלי, גיל מקסימלי וצבע")
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
                    value={name}
                    onChange={(e) =>
                        handleInputChange(setName, e.target.value)
                    }
                />

                {/* בחירת המגדר שעבורו המתנה מיועדת */}
                <label htmlFor="gender">מיועד עבור</label>
                <select
                    id="gender"
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
                    value={age2}
                    onChange={(e) =>
                        handleInputChange(setAge2, e.target.value)
                    }
                />

                {/* בחירת קטגוריה מתוך הקטגוריות הקיימות במסד הנתונים */}
                <label htmlFor="category">קטגוריה</label>
                <select
                    id="category"
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

                {/* צבע המתנה */}
                <label htmlFor="color">צבע</label>
                <input
                    id="color"
                    type="text"
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
