import { useState } from 'react'
import Axios from 'axios'
const Questionnaire = ({ }) => {
  const [formData, setFormData] = useState({
    forGender: '',
    age: '',
    styles: [],
    DedicationPersonalization: false,
    category: '',
    event: '',
    relationship: '',
    color: '',
    price: ''
  })
  const [matchingGifts, setMatchingGifts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
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
    const token = localStorage.getItem('token')
    setErrorMessage('')
    setMatchingGifts([])
    setHasSearched(false)

    if (!token) {
      setErrorMessage('יש להתחבר למערכת כדי לחפש מתנות')
      return
    }

    setIsLoading(true)
    const fetchMatchingGifts = async () => {
      try {
        const response = await Axios.post('http://localhost:7002/api/gift/matchGifts',
          formData,
          {
            headers: Object.assign({
              Authorization: `Bearer ${token}`
            }, { Authorization: `Bearer ${token}` })
          }
        )
        if (!Array.isArray(response.data?.gifts)) {
          throw new Error('השרת החזיר תשובה לא תקינה')
        }

        setMatchingGifts(response.data.gifts.filter(result => result.gift))
        setHasSearched(true)
      } catch (error) {
        console.error('Error fetching matching gifts:', error)
        setErrorMessage(error.response?.data?.message || error.message || 'לא הצלחנו למצוא מתנות מתאימות')
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchMatchingGifts()
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
            {['בן', 'בת', 'לא משנה'].map(gender => (
              <label key={gender} style={{ marginLeft: '10px' }}>
                <input
                  type="radio"
                  name="forGender"
                  value={gender}
                  checked={formData.forGender === gender}
                  onChange={(e) => setFormData({ ...formData, forGender: e.target.value })}
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>גיל מקבל המתנה:</label>
          <input
            type="number"
            placeholder="הכנס גיל"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            style={{ marginRight: '10px', padding: '5px' }}
          />
        </div>
      </fieldset>

      {/* שלב 2: אירוע ומערכת יחסים */}
      <fieldset style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <legend><strong>מה מטרת המתנה?</strong></legend>

        <div style={{ marginBottom: '15px' }}>
          <label>סוג האירוע:</label>
          <select
            value={formData.event}
            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">בחר אירוע...</option>
            <option value="יום הולדת">יום הולדת</option>
            <option value="חתונה">חתונה</option>
            <option value="בר מצוה">בר מצוה</option>
            <option value="בת מצוה">בת מצוה</option>
            <option value="הולדת תינוק">הולדת תינוק</option>
            <option value="חג">חג / ראש השנה / פסח</option>
            <option value="מעבר דירה">מעבר דירה</option>
            <option value="הודיה/הערכה">הודיה/הערכה</option>
          </select>
        </div>

        <div>
          <label>קשר / קירבה:</label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">בחר קשר...</option>
            <option value="בן / בת זוג">בן / בת זוג</option>
            <option value="משפחה">משפחה</option>
            <option value="חבר/ה">חבר/ה</option>
            <option value="קולגה לעבודה">קולגה לעבודה</option>
            <option value="אחר">אחר</option>
          </select>
        </div>
      </fieldset>

      {/* שלב 3: סגנון, קטגוריה והתאמה אישית */}
      <fieldset style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <legend><strong>אופי והתאמת המתנה</strong></legend>

        <div style={{ marginBottom: '15px' }}>
          <label>קטגוריה:</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">בחר קטגוריה...</option>
            <option value="משחקים וצעצועים">משחקים וצעצועים</option>
            <option value="כלי בית ועיצוב">כלי בית ועיצוב</option>
            <option value="ספרים ומוצרי נייר">ספרים ומוצרי נייר</option>
            <option value="מארזים ומתוקים">מארזים ומתוקים</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>סגנון המתנה (ניתן לבחור כמה):</label>
          <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['שימושי', 'דקורטיבי', 'חווייתי', 'אישי/מרגש', 'יוקרתי', 'מצחיק/מקורי'].map(style => (
              <label key={style}>
                <input
                  type="checkbox"
                  value={style}
                  checked={formData.styles.includes(style)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        styles: [...formData.styles, style]
                      })
                    } else {
                      setFormData({
                        ...formData,
                        styles: formData.styles.filter(s => s !== style)
                      })
                    }
                  }}
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={formData.DedicationPersonalization}
              onChange={(e) => setFormData({
                ...formData,
                DedicationPersonalization: e.target.checked
              })}
            />
            נדרשת אפשרות להקדשה / התאמה אישית
          </label>
        </div>
      </fieldset>

      {/* שלב 4: תקציב ומראה */}
      <fieldset style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <legend><strong>תקציב ומראה</strong></legend>

        <div style={{ marginBottom: '15px' }}>
          <label>תקציב מקסימלי (בש"ח):</label>
          <input
            type="number"
            placeholder="לדוגמה: 200"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>צבע מועדף:</label>
          <input
            type="text"
            placeholder="לדוגמה: כחול, זהב, לבן"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
      </fieldset>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}
      >
        {isLoading ? 'מחפש מתנות...' : 'חפש מתנות מתאימות'}
      </button>

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {hasSearched && matchingGifts.length === 0 && !errorMessage && (
        <p>לא נמצאו מתנות מתאימות</p>
      )}

      {matchingGifts.length > 0 && (
        <section aria-label="מתנות מתאימות">
          <h3>המתנות המתאימות עבורך</h3>

          {matchingGifts.map(result => (
            <article key={result.gift._id}>

              <h4>{result.gift.name}</h4>

              <p>אחוז התאמה: {result.score}%</p>

              <p>מחיר: {result.gift.price} ₪</p>

              {result.gift.color && <p>צבע: {result.gift.color}</p>}

              {result.gift.description && <p>תיאור: {result.gift.description}</p>}

              {result.gift.image && (
                <img
                  src={result.gift.image}
                  alt={result.gift.name}
                  width="150"
                />
              )}

            </article>
          ))}
        </section>
      )}
    </div>
  );

}
export default Questionnaire
