import React, { useState, useEffect } from 'react'
import Axios from "axios"
import { useFeedback } from '../common/Feedback'

const firstReferenceId = (value) => {
    const first = Array.isArray(value) ? value[0] : value
    return typeof first === 'object' && first !== null ? first._id || "" : first || ""
}

export const UpdateGift = ({ gift, onUpdated }) => {
    const { toast } = useFeedback()

    // שדות בסיסיים
    const [name, setName] = useState("")
    const [gender, setGender] = useState("לא משנה")
    const [age1, setAge1] = useState("")
    const [age2, setAge2] = useState("")
    const [color, setColor] = useState("")
    const [price, setPrice] = useState("")

    // state לקובץ התמונה החדש שנבחר
    const [imageFile, setImageFile] = useState(null)
    const [description, setDescription] = useState("")

    // שדות מרובי בחירה (מערכים של מזהים)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedEvents, setSelectedEvents] = useState([])
    const [selectedRelationships, setSelectedRelationships] = useState([])

    const [dedicationPersonalization, setDedicationPersonalization] = useState(false)
    const [styles, setStyles] = useState([])

    // רשימות נתונים מהשרת
    const [categories, setCategories] = useState([])
    const [events, setEvents] = useState([])
    const [relationships, setRelationships] = useState([])

    const [errorMessage, setErrorMessage] = useState("")

    // אפשרויות סגנון לפי ה-enum בשרת
    const availableStyles = ['שימושי', 'דקורטיבי', 'חווייתי', 'אישי/מרגש', 'יוקרתי', 'מצחיק/מקורית']

    // פונקציית עזר לחילוץ מערך מזהים ממתנה קיימת (תומכת במערך או באובייקט/מזהה בודד)
    const extractIds = (field) => {
        if (!field) return []
        if (Array.isArray(field)) {
            return field.map(item => (typeof item === 'object' ? item?._id : item)).filter(Boolean)
        }
        const singleId = typeof field === 'object' ? field?._id : field
        return singleId ? [singleId] : []
    }

    // טעינת הנתונים מהשרת (קטגוריות, אירועים וקשרים)
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

            const [catRes, eventRes, relRes] = await Promise.allSettled([
                Axios.get("http://localhost:7002/api/category", config),
                Axios.get("http://localhost:7002/api/event", config),
                Axios.get("http://localhost:7002/api/relationship", config)
            ])

            if (catRes.status === "fulfilled") {
                const data = catRes.value.data
                setCategories(Array.isArray(data) ? data : data.categories || data.data || [])
            }

            if (eventRes.status === "fulfilled") {
                const data = eventRes.value.data
                setEvents(Array.isArray(data) ? data : data.events || data.data || [])
            }

            if (relRes.status === "fulfilled") {
                const data = relRes.value.data
                setRelationships(Array.isArray(data) ? data : data.relationships || data.data || [])
            }

            if (catRes.status === "rejected" || eventRes.status === "rejected" || relRes.status === "rejected") {
                console.error("שגיאה בטעינת חלק מהרשימות:", { catRes, eventRes, relRes })
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

            setSelectedCategories(extractIds(gift.categories || gift.category))
            setSelectedEvents(extractIds(gift.events || gift.event))
            setSelectedRelationships(extractIds(gift.relationships || gift.relationship))

            setColor(gift.color || "")
            setPrice(gift.price ?? "")
            setDescription(gift.description || "")
            setDedicationPersonalization(Boolean(gift.DedicationPersonalization))
            setStyles(gift.styles || [])
            setImageFile(null)
        }
    }, [gift])

    const handleInputChange = (setter, value) => {
        setter(value)
        if (errorMessage) setErrorMessage("")
    }

    // פונקציית עזר כללית להוספה/הסרה מרשימת בחירה מרובה
    const toggleArrayItem = (currentArray, setter, item) => {
        if (currentArray.includes(item)) {
            setter(currentArray.filter(i => i !== item))
        } else {
            setter([...currentArray, item])
        }
        if (errorMessage) setErrorMessage("")
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (!name || selectedCategories.length === 0 || selectedEvents.length === 0 || selectedRelationships.length === 0) {
            setErrorMessage("יש למלא שם ולבחור לפחות קטגוריה אחת, אירוע אחד וקשר אחד")
            return
        }

        if (age1 !== "" && age2 !== "" && Number(age1) > Number(age2)) {
            setErrorMessage("הגיל המינימלי אינו יכול להיות גדול מהגיל המקסימלי")
            return
        }

        try {
            const formData = new FormData()
            formData.append("id", gift._id)
            formData.append("name", name)
            formData.append("forGender", gender)
            formData.append("age1", Number(age1))
            formData.append("age2", Number(age2))
            formData.append("color", color)
            formData.append("price", Number(price))
            formData.append("description", description)
            formData.append("DedicationPersonalization", dedicationPersonalization)

            selectedCategories.forEach((catId) => {
                formData.append("categories", catId)
            })

            selectedEvents.forEach((eventId) => {
                formData.append("events", eventId)
            })

            selectedRelationships.forEach((relId) => {
                formData.append("relationships", relId)
            })

            styles.forEach((style) => {
                formData.append("styles", style)
            })

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
                        <span className="ag-label">למי מיועד <small>אפשר לבחור כמה</small></span>
                        <div className="ag-choices">
                            {relationships.map((item) => (
                                <label
                                    key={item._id}
                                    className={`ag-choice ${selectedRelationships.includes(item._id) ? "ag-choice--on" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRelationships.includes(item._id)}
                                        onChange={() => toggleArrayItem(selectedRelationships, setSelectedRelationships, item._id)}
                                    />
                                    {item.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </fieldset>

                {/* ----- קטגוריה, אירוע וסגנון ----- */}
                <fieldset className="ag-section">
                    <legend className="ag-legend"><span>3</span>קטגוריה, אירוע וסגנון</legend>

                    <div className="ag-field">
                        <span className="ag-label">קטגוריות <small>אפשר לבחור כמה</small></span>
                        <div className="ag-choices">
                            {categories.map((item) => (
                                <label
                                    key={item._id}
                                    className={`ag-choice ${selectedCategories.includes(item._id) ? "ag-choice--on" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(item._id)}
                                        onChange={() => toggleArrayItem(selectedCategories, setSelectedCategories, item._id)}
                                    />
                                    {item.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="ag-field">
                        <span className="ag-label">אירועים <small>אפשר לבחור כמה</small></span>
                        <div className="ag-choices">
                            {events.map((item) => (
                                <label
                                    key={item._id}
                                    className={`ag-choice ${selectedEvents.includes(item._id) ? "ag-choice--on" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedEvents.includes(item._id)}
                                        onChange={() => toggleArrayItem(selectedEvents, setSelectedEvents, item._id)}
                                    />
                                    {item.name}
                                </label>
                            ))}
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
                                        onChange={() => toggleArrayItem(styles, setStyles, style)}
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