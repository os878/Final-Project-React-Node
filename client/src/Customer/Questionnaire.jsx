import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiftContext } from '../context/GiftContext';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // מצבים לשמירת האפשרויות שיגיעו מהדאטהבייס
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const { formData, setFormData, setMatchingGifts, setAiInspirations } = useContext(GiftContext);

  // טעינת אפשרויות (קטגוריות, אירועים, קשרים) מהשרת בעת עשיית Render ראשוני
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [categoryRes, eventRes, relationshipRes] = await Promise.all([
          Axios.get('http://localhost:7002/api/category', config),
          Axios.get('http://localhost:7002/api/event', config),
          Axios.get('http://localhost:7002/api/relationship', config)
        ]);

        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : categoryRes.data?.data || []);
        setEvents(Array.isArray(eventRes.data) ? eventRes.data : eventRes.data?.data || []);
        setRelationships(Array.isArray(relationshipRes.data) ? relationshipRes.data : relationshipRes.data?.data || []);
      } catch (error) {
        console.error('שגיאה בטעינת אפשרויות מהשרת:', error);
        setErrorMessage('לא ניתן לטעון את אפשרויות הבחירה. נסי לרענן את הדף.');
      }
    };

    fetchOptions();
  }, []);

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

  // פונקציה 2: קבלת השראות מבינה מלאכותית
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
          timeout: 360000 // זמן קצוב של 360 שניות
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

      {/* שלב 2: אירוע ומערכת יחסים (טעון מהשרת) */}
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
            {events.map((item) => (
              <option key={item._id || item.id} value={item._id || item.name}>
                {item.name}
              </option>
            ))}
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
            {relationships.map((item) => (
              <option key={item._id || item.id} value={item._id || item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* שלב 3: סגנון, קטגוריה והתאמה אישית (טעון מהשרת) */}
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
            {categories.map((item) => (
              <option key={item._id || item.id} value={item._id || item.name}>
                {item.name}
              </option>
            ))}
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
                  checked={formData.styles ? formData.styles.includes(style) : false}
                  onChange={(e) => {
                    const currentStyles = formData.styles || [];
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        styles: [...currentStyles, style]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        styles: currentStyles.filter(s => s !== style)
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
              checked={formData.DedicationPersonalization || false}
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