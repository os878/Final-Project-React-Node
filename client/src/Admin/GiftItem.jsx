import React, { useState } from 'react';
import { useFeedback } from '../common/Feedback';
import { EditIcon, TrashIcon, GiftIcon, StarIcon } from '../common/Icons';
import { API_URL } from '../config'; // כתובת השרת – מוגדרת במקום אחד

const GiftItem = ({ gift, onDelete, onEdit }) => {
  const { toast, confirm } = useFeedback();
  // האם המתנה מוצגת בדף הנחיתה ("מתנות שאוהבים עכשיו")
  const [featured, setFeatured] = useState(Boolean(gift.featured));

  const toggleFeatured = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/gift/featured/${gift._id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('עדכון המתנה נכשל');
      }
      const data = await response.json();
      setFeatured(data.featured);
      toast(data.featured ? 'המתנה תוצג בדף הנחיתה' : 'המתנה הוסרה מדף הנחיתה', 'success');
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'מחיקת מתנה',
      message: 'האם את בטוחה שברצונך למחוק את המתנה?',
      confirmText: 'מחיקה',
      cancelText: 'ביטול',
      danger: true
    });
    if (!ok) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/gift/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: gift._id })
      });

      if (!response.ok) {
        throw new Error('מחיקת המתנה נכשלה');
      }

      onDelete(gift._id);
    } catch (error) {
      toast(error.message, "error");
    }
  };


  // פונקציית עזר לחילוץ שם מפריט בודד
  const extractSingleName = (item) => {
    if (!item) return '';
    if (typeof item === 'object') {
      return item.name || item.categoryName || item.title || item.label || '';
    }
    return String(item);
  };

  // פונקציית עזר לחילוץ שמות ממערך או מאובייקט בודד וחיבורם בפסיק
  const getDisplayNames = (field, fallbackText) => {
    if (!field) return fallbackText;

    if (Array.isArray(field)) {
      const names = field.map(extractSingleName).filter(Boolean);
      return names.length > 0 ? names.join(', ') : fallbackText;
    }

    const singleName = extractSingleName(field);
    return singleName || fallbackText;
  };

  return (
    <article className="pg-card gift-item">
      <div className="pg-card__media">
        {gift.image ? (
          <img src={gift.image} alt={gift.name} className="pg-card__img" />
        ) : (
          <span className="pg-card__placeholder"><GiftIcon /></span>
        )}

        <span className="pg-card__score">
          {getDisplayNames(gift.categories || gift.category, 'לא צוינה קטגוריה')}
        </span>

        {/* כוכב על התמונה: האם המתנה מוצגת בדף הנחיתה */}
        <button
          type="button"
          className={`sgi-feature ${featured ? 'sgi-feature--on' : ''}`}
          onClick={toggleFeatured}
          aria-pressed={featured}
          aria-label={featured ? `הסרת ${gift.name} מדף הנחיתה` : `הצגת ${gift.name} בדף הנחיתה`}
          title={featured ? 'מוצגת בדף הנחיתה – לחיצה תסיר' : 'הצגה בדף הנחיתה'}
        >
          <StarIcon />
        </button>

      </div>

      <div className="pg-card__body">
        <h3 className="pg-card__title">{gift.name}</h3>
        <p className="pg-card__text">{gift.description || 'אין תיאור'}</p>

        {/* פרטי התאמה */}
        <dl className="ad-specs">
          <div><dt>מיועד עבור</dt><dd>{gift.forGender || 'לא משנה'}</dd></div>
          <div><dt>גילאים</dt><dd>{gift.age1} עד {gift.age2}</dd></div>

          <div>
            <dt>אירוע</dt>
            <dd>{getDisplayNames(gift.events || gift.event, 'לא צוין אירוע')}</dd>
          </div>
          <div>
            <dt>למי מיועד</dt>
            <dd>{getDisplayNames(gift.relationships || gift.relationship, 'לא צוין קשר')}</dd>
          </div>
          <div><dt>צבע</dt><dd>{gift.color}</dd></div>
          <div><dt>הקדשה אישית</dt><dd>{gift.DedicationPersonalization ? 'כן' : 'לא'}</dd></div>
        </dl>

        {gift.styles && gift.styles.length > 0 && (
          <div className="ad-tags">
            {gift.styles.map((style) => <span key={style} className="sgi-chip">{style}</span>)}
          </div>
        )}

        <div className="pg-card__footer">
          <span className="pg-card__price">{gift.price} ₪</span>
          <div className="sgi-actions">
            <button type="button" className="sgi-btn" onClick={() => onEdit(gift)}>
              <EditIcon />
              עריכה
            </button>
            <button type="button" className="sgi-btn sgi-btn--danger" onClick={handleDelete} aria-label={`מחיקת ${gift.name}`}>
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default GiftItem;