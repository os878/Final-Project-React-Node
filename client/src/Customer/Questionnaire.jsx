import React, { useState, useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiftContext } from '../context/GiftContext';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { formData, setFormData, setMatchingGifts, setAiInspirations } = useContext(GiftContext);

  // פונקציה 1: חיפוש מתנות מספקים
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setErrorMessage('');

    if (!token) {
      setErrorMessage('יש להתחבר למערכת כדי לחפש מתנות');
      return;
    }

    setIsLoading(true);
    const fetchMatchingGifts = async () => {
      try {
        const response = await Axios.post(
          'http://localhost:7002/api/gift/matchGifts',
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!Array.isArray(response.data?.gifts)) {
          throw new Error('השרת החזיר תשובה לא תקינה');
        }

        setMatchingGifts(response.data.gifts);
        navigate('/PresentingGifts');
      } catch (error) {
        console.error('Error fetching matching gifts:', error);
        setErrorMessage(error.response?.data?.message || error.message || 'לא הצלחנו למצוא מתנות מתאימות');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatchingGifts();
  };

  // פונקציה 2: קבלת השראות מבינה מלאכותית עם הגדרת Timeout של 30 שניות
  const handleAiInspirations = async () => {
    const token = localStorage.getItem('token');
    setErrorMessage('');

    if (!token) {
      setErrorMessage('יש להתחבר למערכת כדי לקבל השראות');
      return;
    }

    setIsLoading(true);

    try {
      const response = await Axios.post(
        'http://localhost:7002/api/gift/getAiInspirations',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 360000 // הגדרת זמן קצוב של 360 שניות
        }
      );

      if (response.data?.inspirations) {
        if (setAiInspirations) {
          setAiInspirations(response.data.inspirations);
        }
        navigate('/Giftinspirations', { state: { inspirations: response.data.inspirations } });
      }
    } catch (error) {
      console.error('Error fetching AI inspirations:', error);
      if (error.code === 'ECONNABORTED') {
        setErrorMessage('הבקשה לקחה יותר מדי זמן, אנא נסי שוב.');
      } else {
        setErrorMessage(error.response?.data?.message || 'לא הצלחנו לקבל השראות כעת');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
                      });
                    } else {
                      setFormData({
                        ...formData,
                        styles: formData.styles.filter(s => s !== style)
                      });
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
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {isLoading ? 'מחפש מתנות...' : 'חפש מתנות מתאימות מספקים'}
      </button>

      <button
        onClick={handleAiInspirations}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isLoading ? '#6c757d' : '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {isLoading ? 'מייצר השראות...' : 'קבלת הצעות להשראה מבינה מלאכותית'}
      </button>

      {errorMessage && <p role="alert" style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
    </div>
  );
};

export default Questionnaire;