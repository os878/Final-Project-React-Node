import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GiftContext } from '../context/GiftContext';

const Giftinspirations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { aiInspirations } = useContext(GiftContext) || {};

  // שליפת ההשראות מתוך ה-state של ה-Navigate או מתוך ה-Context
  const inspirations = location.state?.inspirations || aiInspirations || [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h2>הצעות השראה מבינה מלאכותית</h2>
      <p>להלן 3 רעיונות מקוריים שנבנו במיוחד לפי השאלון שלך:</p>

      {inspirations.length === 0 ? (
        <div>
          <p>לא נמצאו הצעות השראה להצגה.</p>
          <button 
            onClick={() => navigate('/Questionnaire')}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            חזרה לשאלון
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {inspirations.map((item, index) => (
            <div 
              key={index} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ marginTop: 0, color: '#28a745' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.5' }}>{item.description}</p>
              {item.estimatedPrice && (
                <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
                  הערכת מחיר: {item.estimatedPrice}
                </div>
              )}
            </div>
          ))}

          <button 
            onClick={() => navigate('/Questionnaire')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            חיפוש נוסף
          </button>
        </div>
      )}
    </div>
  );
};

export default Giftinspirations;