import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GiftContext } from '../context/GiftContext';

const QUESTIONNAIRE = '/Customer/Questionnaire';

const Icon = ({ children, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const BulbIcon = (props) => (
  <Icon {...props}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></Icon>
);
const TagIcon = (props) => (
  <Icon {...props}><path d="M3 12V4h8l10 10-8 8Z" /><circle cx="7.5" cy="8.5" r="1.3" /></Icon>
);
const HomeIcon = (props) => (
  <Icon {...props}><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></Icon>
);
const EditIcon = (props) => (
  <Icon {...props}><path d="M15 4l5 5L9 20H4v-5Z" /><path d="M13 6l5 5" /></Icon>
);

// מחיר: אם הגיע רק מספר – מוסיפים ₪, אם הגיע טקסט (למשל "150 ש"ח") – מציגים כמו שהוא
const formatPrice = (price) => {
  if (price === undefined || price === null || price === '') return '';
  const text = String(price).trim();
  return /^\d+([.,]\d+)?$/.test(text) ? `${Number(text).toLocaleString('he-IL')} ₪` : text;
};

const Giftinspirations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { aiInspirations } = useContext(GiftContext) || {};

  // שליפת ההשראות מתוך ה-state של ה-Navigate או מתוך ה-Context
  const inspirations = location.state?.inspirations || aiInspirations || [];

  return (
    <section className="ins" dir="rtl">
      <header className="ins-head">
        <span className="ins-badge">
          <BulbIcon className="ins-badge__icon" />
          השראה מבינה מלאכותית
        </span>
        <h1 className="ins-title">רעיונות שנבנו במיוחד בשבילו</h1>
        <p className="ins-sub">לפי התשובות שלכם בשאלון. אפשר לקחת רעיון כמו שהוא, או רק את הכיוון.</p>
      </header>

      {inspirations.length === 0 ? (
        <div className="ins-empty">
          <span className="ins-empty__icon"><BulbIcon /></span>
          <h2>עוד אין כאן רעיונות</h2>
          <p>ממלאים את השאלון, ובוחרים בסוף "השראה מבינה מלאכותית".</p>
          <button type="button" className="ins-btn ins-btn--main" onClick={() => navigate(QUESTIONNAIRE)}>
            לשאלון
          </button>
        </div>
      ) : (
        <>
          <ol className="ins-list">
            {inspirations.map((item, index) => (
              <li key={index} className="ins-card">
                <span className="ins-card__num" aria-hidden="true">{index + 1}</span>
                <div className="ins-card__body">
                  <h2 className="ins-card__title">{item.title}</h2>
                  <p className="ins-card__text">{item.description}</p>
                  {item.estimatedPrice && (
                    <span className="ins-card__price">
                      <TagIcon className="ins-card__price-icon" />
                      הערכת מחיר: <strong>{formatPrice(item.estimatedPrice)}</strong>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="ins-actions">
            <p className="ins-actions__text">לא מצאתם את מה שחיפשתם?</p>
            <div className="ins-actions__buttons">
              {/* התשובות נשמרות, אז אפשר לשנות רק חלק מהן */}
              <button type="button" className="ins-btn ins-btn--main" onClick={() => navigate(QUESTIONNAIRE)}>
                <EditIcon className="ins-btn__icon" />
                לשנות תשובות בשאלון
              </button>
              <button type="button" className="ins-btn ins-btn--ghost" onClick={() => navigate('/Customer/ProfilCustomer')}>
                <HomeIcon className="ins-btn__icon" />
                לאזור שלי
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Giftinspirations;