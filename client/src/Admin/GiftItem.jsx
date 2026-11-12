import React from 'react';
import { useFeedback } from '../common/Feedback';
import { EditIcon, TrashIcon, GiftIcon } from '../common/Icons';

const GiftItem = ({ gift, onDelete, onEdit }) => {
  const { toast, confirm } = useFeedback();

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

      const response = await fetch('http://localhost:7002/api/gift/delete', {
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

  // פונקציית עזר מורחבת לחילוץ השם מכל מבנה אובייקט
  const getDisplayName = (field, fallbackText) => {
    if (!field) return fallbackText;
    if (typeof field === 'object' && field !== null) {
      return field.name || field.categoryName || field.title || field.label || fallbackText;
    }
    return fallbackText;
  };

  return (
    <article className="pg-card gift-item">
      <div className="pg-card__media">
        {gift.image ? (
          <img src={gift.image} alt={gift.name} className="pg-card__img" />
        ) : (
          <span className="pg-card__placeholder"><GiftIcon /></span>
        )}
        <span className="pg-card__score">{getDisplayName(gift.category, 'לא צוינה קטגוריה')}</span>
      </div>

      <div className="pg-card__body">
        <h3 className="pg-card__title">{gift.name}</h3>
        <p className="pg-card__text">{gift.description || 'אין תיאור'}</p>

        {/* פרטי התאמה */}
        <dl className="ad-specs">
          <div><dt>מיועד עבור</dt><dd>{gift.forGender || 'לא משנה'}</dd></div>
          <div><dt>גילאים</dt><dd>{gift.age1} עד {gift.age2}</dd></div>
          <div><dt>אירוע</dt><dd>{getDisplayName(gift.event, 'לא צוין אירוע')}</dd></div>
          <div><dt>למי מיועד</dt><dd>{getDisplayName(gift.relationship, 'לא צוין קשר')}</dd></div>
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