import React, { useState, useEffect } from 'react'
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { useFeedback } from '../common/Feedback'

export const AddGift = ({ gift, onUpdated }) => {
    const navigate = useNavigate()
    const { toast } = useFeedback()

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
    const [imageFile, setImageFile] = useState(null)
    const [description, setDescription] = useState("")

    const [categories, setCategories] = useState([])
    const [events, setEvents] = useState([])
    const [relationships, setRelationships] = useState([])

    const [errorMessage, setErrorMessage] = useState("")

    // ===== חדש: תצוגה מקדימה של התמונה שנבחרה (או התמונה הקיימת בעריכה) =====
    const [previewUrl, setPreviewUrl] = useState("")
    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(gift?.image || "")
            return
        }
        const url = URL.createObjectURL(imageFile)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [imageFile, gift])

    // טעינת הקטגוריות, האירועים והקשרים מהדאטהבייס
    useEffect(() => {
        const getGiftOptions = async () => {
            try {
                const token = localStorage.getItem("token")
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

                const [categoryResponse, eventResponse, relationshipResponse] = await Promise.all([
                    Axios.get("http://localhost:7002/api/category", config),
                    Axios.get("http://localhost:7002/api/event", config),
                    Axios.get("http://localhost:7002/api/relationship", config)
                ])

                // וידוא שהנתונים המתקבלים הם מערכים
                setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : categoryResponse.data.data || [])
                setEvents(Array.isArray(eventResponse.data) ? eventResponse.data : eventResponse.data.data || [])
                setRelationships(Array.isArray(relationshipResponse.data) ? relationshipResponse.data : relationshipResponse.data.data || [])
            } catch (error) {
                console.error("לא ניתן לטעון את אפשרויות המתנה:", error)
                setErrorMessage("לא ניתן לטעון קטגוריות, אירועים וקשרים. נסו לרענן את הדף.")
            }
        }

        getGiftOptions()
    }, [])

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
            setDescription(gift.description || "")
            setImageFile(null)
        }
    }, [gift])

    const handleInputChange = (setter, value) => {
        setter(value)
        if (errorMessage) {
            setErrorMessage("")
        }
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")

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
            const formData = new FormData()
            formData.append("name", name)
            formData.append("forGender", gender)
            formData.append("age1", Number(age1))
            formData.append("age2", Number(age2))
            formData.append("category", category)
            formData.append("event", event)
            formData.append("relationship", relationship)
            formData.append("DedicationPersonalization", dedicationPersonalization)
            formData.append("color", color)
            formData.append("price", Number(price))
            formData.append("description", description)

            styles.forEach((style) => {
                formData.append("styles", style)
            })

            if (imageFile) {
                formData.append("image", imageFile)
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            if (gift) {
                formData.append("id", gift._id)

                const { data } = await Axios.put(
                    "http://localhost:7002/api/gift",
                    formData,
                    config
                )

                toast("המתנה עודכנה בהצלחה!", "success")

                // עריכה מתוך הרשימה: נשארים ברשימה ורואים את השינוי.
                // אם השרת לא החזיר את המתנה – שולחים את המתנה הקיימת, והרשימה נטענת מחדש ממילא.
                if (onUpdated) {
                    onUpdated(data.gift || gift)
                } else {
                    navigate("/Supplier/ProfilSupplier")
                }
            } else {
                await Axios.post(
                    "http://localhost:7002/api/gift",
                    formData,
                    config
                )

                toast("המתנה נוספה בהצלחה!", "success")

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
                setImageFile(null)
                setDescription("")
            }

        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setErrorMessage(error.response.data.message)
            } else {
                setErrorMessage("אירעה שגיאה בעת שמירת המתנה")
            }
        }
    }

    return (
        <div className="ag" dir="rtl">
            <div className="ag-head">
                <h2 className="ag-title">{gift ? "עריכת מתנה" : "הוספת מתנה חדשה"}</h2>
                {!gift && <p className="ag-sub">ככל שתמלאו יותר פרטים, המוצר יגיע ללקוחות מתאימים יותר.</p>}
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
                            required
                            value={name}
                            onChange={(e) => handleInputChange(setName, e.target.value)}
                        />
                    </div>

                    <div className="ag-field">
                        <label htmlFor="description">תיאור המתנה</label>
                        <textarea
                            id="description"
                            rows="3"
                            placeholder="מה זה, ממה זה עשוי ולמי זה מתאים"
                            value={description}
                            onChange={(e) => handleInputChange(setDescription, e.target.value)}
                        />
                    </div>

                    <div className="ag-field">
                        <span className="ag-label">תמונת המתנה</span>
                        <label htmlFor="image" className="ag-upload">
                            {previewUrl ? (
                                <img src={previewUrl} alt="" className="ag-upload__img" />
                            ) : (
                                <span className="ag-upload__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 8" />
                                    </svg>
                                </span>
                            )}
                            <span className="ag-upload__text">
                                <strong>{previewUrl ? "החלפת תמונה" : "בחירת תמונה"}</strong>
                                <span>{imageFile ? imageFile.name : "JPG או PNG"}</span>
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
                                required
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
                                required
                                value={age2}
                                onChange={(e) => handleInputChange(setAge2, e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ag-field">
                        <label htmlFor="relationship">קשר / קרבה</label>
                        <select
                            id="relationship"
                            required
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
                                required
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
                                required
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
                        <span className="ag-label">סגנון המתנה <small>אפשר לבחור כמה</small></span>
                        <div className="ag-choices">
                            {['שימושי', 'דקורטיבי', 'חווייתי', 'אישי/מרגש', 'יוקרתי', 'מצחיק/מקורית'].map((style) => (
                                <label key={style} className={`ag-choice ${styles.includes(style) ? "ag-choice--on" : ""}`}>
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
                        </div>
                    </div>

                    <label className="qz-switch" htmlFor="dedicationPersonalization">
                        <input
                            id="dedicationPersonalization"
                            type="checkbox"
                            checked={dedicationPersonalization}
                            onChange={(e) =>
                                handleInputChange(setDedicationPersonalization, e.target.checked)
                            }
                        />
                        <span className="qz-switch__track" aria-hidden="true"><span className="qz-switch__thumb" /></span>
                        <span className="qz-switch__text">ניתן להוסיף הקדשה / התאמה אישית</span>
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
                                    required
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
                                required
                                placeholder="לדוגמה: זהב, לבן"
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

                <button type="submit" className="ag-submit">
                    {gift ? "שמירת שינויים" : "הוספת מתנה"}
                </button>

            </form>
        </div>
    )
}

export default AddGift