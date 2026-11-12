import React, { useState, useEffect } from 'react'
import Axios from "axios"
import { useFeedback } from '../common/Feedback'

export const UpdateGift = ({ gift, onUpdated }) => {
    const { toast } = useFeedback()

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

            toast("המתנה עודכנה בהצלחה!", "success")

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
        <div className="ag" dir="rtl">
            <div className="ag-head">
                <h2 className="ag-title">עריכת מתנה</h2>
            </div>
            <form className="ag-form" onSubmit={submitForm}>

                {/* ----- פרטי המתנה ----- */}
                <fieldset className="ag-section">
                    <legend className="ag-legend"><span>1</span>פרטי המתנה</legend>

                    <div className="ag-field">
                        <label htmlFor="giftName">שם המתנה</label>
                        <input
                            id="giftName"
                            type="text"
                            value={name}
                            onChange={(e) => handleInputChange(setName, e.target.value)}
                        />
                    </div>

                    <div className="ag-field">
                        <label htmlFor="description">תיאור המתנה</label>
                        <textarea
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => handleInputChange(setDescription, e.target.value)}
                        />
                    </div>

                    <div className="ag-field">
                        <span className="ag-label">החלפת תמונה (אופציונלי)</span>
                        <label htmlFor="image" className="ag-upload">
                            {gift?.image && !imageFile ? (
                                <img src={gift.image} alt="" className="ag-upload__img" />
                            ) : (
                                <span className="ag-upload__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 8" />
                                    </svg>
                                </span>
                            )}
                            <span className="ag-upload__text">
                                <strong>{imageFile ? "נבחרה תמונה חדשה" : "בחירת תמונה חדשה"}</strong>
                                <span>{imageFile ? imageFile.name : "התמונה הנוכחית תישאר אם לא תבחרו חדשה"}</span>
                            </span>
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
                        </label>
                    </div>
                </fieldset>

                {/* ----- למי זה מתאים ----- */}
                <fieldset className="ag-section">
                    <legend className="ag-legend"><span>2</span>למי זה מתאים</legend>

                    <div className="ag-field">
                        <span className="ag-label" id="genderLabel">מיועד עבור</span>
                        <div className="ag-choices" role="radiogroup" aria-labelledby="genderLabel">
                            {["בן", "בת", "לא משנה"].map((g) => (
                                <label key={g} className={`ag-choice ${gender === g ? "ag-choice--on" : ""}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={gender === g}
                                        onChange={(e) => handleInputChange(setGender, e.target.value)}
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="ag-row">
                        <div className="ag-field">
                            <label htmlFor="age1">מגיל</label>
                            <input
                                id="age1"
                                type="number"
                                min="0"
                                value={age1}
                                onChange={(e) => handleInputChange(setAge1, e.target.value)}
                            />
                        </div>
                        <div className="ag-field">
                            <label htmlFor="age2">עד גיל</label>
                            <input
                                id="age2"
                                type="number"
                                min="0"
                                value={age2}
                                onChange={(e) => handleInputChange(setAge2, e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ag-field">
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
                    </div>
                </fieldset>

                {/* ----- קטגוריה, אירוע וסגנון ----- */}
                <fieldset className="ag-section">
                    <legend className="ag-legend"><span>3</span>קטגוריה, אירוע וסגנון</legend>

                    <div className="ag-row">
                        <div className="ag-field">
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
                        </div>
                        <div className="ag-field">
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
                        </div>
                    </div>

                    <div className="ag-field">
                        <span className="ag-label">סגנונות <small>אפשר לבחור כמה</small></span>
                        <div className="ag-choices">
                            {availableStyles.map((style) => (
                                <label key={style} className={`ag-choice ${styles.includes(style) ? "ag-choice--on" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={styles.includes(style)}
                                        onChange={() => handleStyleChange(style)}
                                    />
                                    {style}
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="qz-switch" htmlFor="dedication">
                        <input
                            id="dedication"
                            type="checkbox"
                            checked={dedicationPersonalization}
                            onChange={(e) => setDedicationPersonalization(e.target.checked)}
                        />
                        <span className="qz-switch__track" aria-hidden="true"><span className="qz-switch__thumb" /></span>
                        <span className="qz-switch__text">אפשרות להקדשה אישית</span>
                    </label>
                </fieldset>

                {/* ----- מחיר וצבע ----- */}
                <fieldset className="ag-section">
                    <legend className="ag-legend"><span>4</span>מחיר וצבע</legend>

                    <div className="ag-row">
                        <div className="ag-field">
                            <label htmlFor="price">מחיר</label>
                            <div className="ag-price">
                                <span aria-hidden="true">₪</span>
                                <input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={(e) => handleInputChange(setPrice, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="ag-field">
                            <label htmlFor="color">צבע</label>
                            <input
                                id="color"
                                type="text"
                                value={color}
                                onChange={(e) => handleInputChange(setColor, e.target.value)}
                            />
                        </div>
                    </div>
                </fieldset>

                {errorMessage && (
                    <p className="pg-error" role="alert">
                        {errorMessage}
                    </p>
                )}

                <button type="submit" className="ag-submit">שמירת שינויים</button>

            </form>
        </div>
    )
}

export default UpdateGift