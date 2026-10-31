import { useState } from 'react'
const Questionnaire = ({ }) => {
    const [formData, setFormData] = useState({
        relationship: '',
        age: '',
        interests: '',
        hobbies: '',
        lifestyle: '',
        favoriteColor: '',
        budget: ''
    })
    //פונקציה לשימרת הנתונים שהלקוח הכניס בטופס השאלון
    //הנתונים יישמרו בסטייט של הקומפוננטה
    //קריאה לפונקציה זו תתבצע בכל פעם שהלקוח ישנה את הערך של אחד מהשדות בטופס השאלון

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    //פונקציה שתשלח את הנתונים שהלקוח הכניס בטופס השאלון לשרת ואז ישלפו המתנות התואמות
    const handleSubmit = (e) => {
        e.preventDefault()
        //שליחת הנתונים לשרת
    }
    //פונקציה שתציג את המתנות התואמות ללקוח לפי הנתונים שהכניס בטופס השאלון
    const displayGifts = () => {
        //שליפת המתנות מהשרת והצגתן ללקוח
    }
    //פונקציה שתשמור את המתנות שהלקוח בחר במועדפים שלו
    const saveFavorites = () => {
        //שמירת המתנות במועדפים של הלקוח
    }
    //פונקציה שתציג את המועדפים של הלקוח
    const displayFavorites = () => {
        //שליפת המועדפים מהשרת והצגתן ללקוח
    }
    //פונקציה שתאפשר ללקוח לשלוח את המתנות שהוא בחר במועדפים שלו לחברים או משפחה
    const shareFavorites = () => {
        //שליחת המועדפים לחברים או משפחה
    }
    //אין עגלת קניות כי הלקוח לא יכול לקנות את המתנות, הוא רק יכול לשמור אותן במועדפים ולשלוח לחברים או משפחה או ליצור קשר אם הספק
    //פונקציה שתאפשר ללקוח ליצור קשר עם הספק של המתנה שהוא בחר במועדפים שלו
    const contactSupplier = () => {
        //שליחת הודעה לספק של המתנה שהלקוח בחר במועדפים שלו
    }

    // return (
    //     <>
    //     // כאן יוצגו הפקדים שבהם הלקוח יבחר את המתנה שהכי מתאימה לו לפי הקטגוריות
    //     //בן /בת זוג /חברים /הורים /ילדים /סבים וסבתות
    //     //המתנה תהיה מותאמת לפי גיל, תחומי עניין, תחביבים, סגנון חיים, צבעים אהובים, תקציב
    //     //הלקוח יבחר את כל הפרמטרים האלה והמערכת תציג לו את המתנות שהכי מתאימות לו
    //     //המערכת תציג את המתנות לפי סדר עדיפות, מהמתנה שהכי מתאימה לו ועד הפחות מתאימה
    //     //יעשה שימוש בAI כדי לנתח את הנתונים שהלקוח הכניס ולהציע לו את המתנות שהכי מתאימות לו

    //     </>
    // )
    return (
        <div className="questionnaire-container">

            <h2>בואו נמצא את המתנה המושלמת!</h2>
            <p>ענו על כמה שאלות ונציע לכם מתנות שמתאימות בדיוק לאדם שאתם מחפשים עבורו.</p>

            <form onSubmit={handleSubmit}>

                {/* למי מיועדת המתנה? */}
                <div>
                    <label>למי מיועדת המתנה?</label>

                    <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחרו למי המתנה מיועדת</option>
                        <option value="בן זוג">בן זוג</option>
                        <option value="בת זוג">בת זוג</option>
                        <option value="חבר">חבר</option>
                        <option value="חברה">חברה</option>
                        <option value="הורים">הורים</option>
                        <option value="ילדים">ילדים</option>
                        <option value="סבים וסבתות">סבים וסבתות</option>
                        <option value="אחר">אחר</option>
                    </select>
                </div>

                {/* גיל מקבל המתנה */}
                <div>
                    <label>מה הגיל של מקבל המתנה?</label>

                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                        max="120"
                        placeholder="הכניסו גיל"
                        required
                    />
                </div>

                {/* תחומי עניין */}
                <div>
                    <label>מהם תחומי העניין שלו?</label>

                    <select
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                    >
                        <option value="">בחרו תחום עניין</option>
                        <option value="לימוד">לימוד</option>
                        <option value="אומנות">אומנות</option>
                        <option value="טכנולוגיה">טכנולוגיה</option>
                        <option value="ספורט">ספורט</option>
                        <option value="בישול">בישול</option>
                        <option value="טיולים">טיולים</option>
                        <option value="אחר">אחר</option>
                    </select>
                </div>

                {/* תחביבים */}
                <div>
                    <label>אילו תחביבים יש לו?</label>

                    <input
                        type="text"
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleChange}
                        placeholder="לדוגמה: קריאה, ציור, נגינה..."
                    />
                </div>

                {/* סגנון חיים */}
                <div>
                    <label>מהו סגנון החיים שלו?</label>

                    <select
                        name="lifestyle"
                        value={formData.lifestyle}
                        onChange={handleChange}
                    >
                        <option value="">בחרו סגנון חיים</option>
                        <option value="פעיל">פעיל ודינמי</option>
                        <option value="רגוע">רגוע וביתי</option>
                        <option value="משפחתי">משפחתי</option>
                        <option value="חברתי">חברתי</option>
                        <option value="יצירתי">יצירתי</option>
                    </select>
                </div>

                {/* צבעים אהובים */}
                <div>
                    <label>מהם הצבעים האהובים עליו?</label>

                    <select
                        name="favoriteColor"
                        value={formData.favoriteColor}
                        onChange={handleChange}
                    >
                        <option value="">בחרו צבע אהוב</option>
                        <option value="לבן">לבן</option>
                        <option value="שחור">שחור</option>
                        <option value="כחול">כחול</option>
                        <option value="זהב">זהב</option>
                        <option value="כסף">כסף</option>
                        <option value="חום">חום</option>
                        <option value="ירוק">ירוק</option>
                        <option value="אדום">אדום</option>
                        <option value="לא משנה">לא משנה</option>
                    </select>
                </div>

                {/* תקציב */}
                <div>
                    <label>מה התקציב שלכם למתנה?</label>

                    <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחרו תקציב</option>
                        <option value="עד 100">עד 100 ₪</option>
                        <option value="100-250">100–250 ₪</option>
                        <option value="250-500">250–500 ₪</option>
                        <option value="500-1000">500–1,000 ₪</option>
                        <option value="מעל 1000">מעל 1,000 ₪</option>
                    </select>
                </div>

                {/* כפתור שליחת השאלון */}
                <button type="submit">
                    מצאו לי מתנה
                </button>

            </form>

        </div>
    );
}
export default Questionnaire