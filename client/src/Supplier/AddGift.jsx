import React, { useState, useEffect } from 'react'
import Axios from "axios"
import { useNavigate } from "react-router-dom"

export const AddGift = ({ gift, onUpdated }) => {
    const navigate = useNavigate()

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

                alert("המתנה עודכנה בהצלחה!")
                navigate("/Supplier/ProfilSupplier")

                if (onUpdated) {
                    onUpdated(data.gift)
                }
            } else {
                await Axios.post(
                    "http://localhost:7002/api/gift",
                    formData,
                    config
                )

                alert("המתנה נוספה בהצלחה!")

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
        <div>
            <h2>{gift ? "עריכת מתנה" : "הוספת מתנה חדשה"}</h2>
            <form onSubmit={submitForm}>

                <label htmlFor="giftName">שם המתנה</label>
                <input
                    id="giftName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleInputChange(setName, e.target.value)}
                />

                <label htmlFor="gender">מיועד עבור</label>
                <select
                    id="gender"
                    required
                    value={gender}
                    onChange={(e) => handleInputChange(setGender, e.target.value)}
                >
                    <option value="בן">בן</option>
                    <option value="בת">בת</option>
                    <option value="לא משנה">לא משנה</option>
                </select>

                <label htmlFor="age1">גיל מינימלי</label>
                <input
                    id="age1"
                    type="number"
                    min="0"
                    required
                    value={age1}
                    onChange={(e) => handleInputChange(setAge1, e.target.value)}
                />

                <label htmlFor="age2">גיל מקסימלי</label>
                <input
                    id="age2"
                    type="number"
                    min="0"
                    required
                    value={age2}
                    onChange={(e) => handleInputChange(setAge2, e.target.value)}
                />

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

                <label htmlFor="color">צבע</label>
                <input
                    id="color"
                    type="text"
                    required
                    value={color}
                    onChange={(e) => handleInputChange(setColor, e.target.value)}
                />

                <label htmlFor="price">מחיר</label>
                <input
                    id="price"
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => handleInputChange(setPrice, e.target.value)}
                />

                <label htmlFor="image">תמונת המתנה</label>
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

                <label htmlFor="description">תיאור המתנה</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => handleInputChange(setDescription, e.target.value)}
                />

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