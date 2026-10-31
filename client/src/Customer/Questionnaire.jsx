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
       <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h2>אשף מציאת מתנה</h2>
      
      {/* שלב 1: מגדר וגיל */}
      <fieldset style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <legend><strong>למי מיועדת המתנה?</strong></legend>
        
        <div style={{ marginBottom: '15px' }}>
          <label>מגדר יעד:</label>
          <div style={{ marginTop: '5px' }}>
            <label style={{ marginLeft: '10px' }}>
              <input type="radio" name="forGender" value="בן" /> בן
            </label>
            <label style={{ marginLeft: '10px' }}>
              <input type="radio" name="forGender" value="בת" /> בת
            </label>
            <label>
              <input type="radio" name="forGender" value="לא משנה" /> לא משנה
            </label>
          </div>
        </div>

        <div>
          <label>גיל מקבל המתנה:</label>
          <input type="number" placeholder="הכנס גיל" style={{ marginRight: '10px', padding: '5px' }} />
        </div>
      </fieldset>

      {/* שלב 2: אירוע ומערכת יחסים */}
      <fieldset style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <legend><strong>מה מטרת המתנה?</strong></legend>
        
        <div style={{ marginBottom: '15px' }}>
          <label>סוג האירוע:</label>
          <select style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">בחר אירוע...</option>
            <option value="event_id_1">יום הולדת</option>
            <option value="event_id_2">חתונה</option>
            <option value="event_id_3">בר מצוה</option>
            <option value="event_id_4">בת מצוה</option>
            <option value="event_id_5">הולדת תינוק</option>
            <option value="event_id_6">חג / ראש השנה / פסח</option>
            <option value="event_id_7">מעבר דירה</option>
            <option value="event_id_8">הודיה/הערכה</option>
          </select>
        </div>

        <div>
          <label>קשר / קירבה נדרשת:</label>
          <select style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">בחר קשר...</option>
            <option value="rel_id_1">בן / בת זוג</option>
            <option value="rel_id_2">משפחה</option>
            <option value="rel_id_3">חבר/ה</option>
            <option value="rel_id_4">קולגה לעבודה</option>
            <option value="rel_id_5">אחר</option>
          </select>
        </div>
      </fieldset>

      {/* שלב 3: סגנון, קטגוריה והתאמה אישית */}
      <fieldset style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <legend><strong>אופי והתאמת המתנה</strong></legend>
        
        <div style={{ marginBottom: '15px' }}>
          <label>קטגוריה:</label>
          <select style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">בחר קטגוריה...</option>
            <option value="cat_id_1">משחקים וצעצועים</option>
            <option value="cat_id_2">כלי בית ועיצוב</option>
            <option value="cat_id_3">ספרים ומוצרי נייר</option>
            <option value="cat_id_4">מארזים ומתוקים</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>סגנון המתנה (ניתן לבחור כמה):</label>
          <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <label><input type="checkbox" value="שימושי" /> שימושי</label>
            <label><input type="checkbox" value="דקורטיבי" /> דקורטיבי</label>
            <label><input type="checkbox" value="חווייתי" /> חווייתי</label>
            <label><input type="checkbox" value="אישי/מרגש" /> אישי/מרגש</label>
            <label><input type="checkbox" value="יוקרתי" /> יוקרתי</label>
            <label><input type="checkbox" value="מצחיק/מקורית" /> מצחיק/מקורית</label>
          </div>
        </div>

        <div>
          <label>
            <input type="checkbox" name="DedicationPersonalization" /> נדרשת אפשרות להקדשה / התאמה אישית
          </label>
        </div>
      </fieldset>

      {/* שלב 4: תקציב ומראה */}
      <fieldset style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <legend><strong>תקציב ומראה</strong></legend>
        
        <div style={{ marginBottom: '15px' }}>
          <label>תקציב מקסימלי (בש"ח):</label>
          <input type="number" placeholder="לדוגמה: 200" style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label>צבע מועדף:</label>
          <input type="text" placeholder="לדוגמה: כחול, זהב, לבן" style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
      </fieldset>

      <button style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
        חפש מתנות מתאימות
      </button>
    </div>
    );
}
export default Questionnaire