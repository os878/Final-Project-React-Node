import React from 'react';
import { useFeedback } from '../common/Feedback';

// ===== חדש: אייקונים =====
const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const GiftIcon = () => <Icon><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" /></Icon>;
const EditIcon = () => <Icon><path d="M15 4l5 5L9 20H4v-5Z" /><path d="M13 6l5 5" /></Icon>;
const TrashIcon = () => <Icon><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Icon>;

const GiftItem = ({ gift, onDelete,onEdit  }) => {
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

      // שולחים בקשת DELETE לשרת
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

      // מסירים מהתצוגה רק אחרי שהשרת אישר את המחיקה
      onDelete(gift._id);
    } catch (error) {
      toast(error.message, "error");
    }
  };
  return (
    <article className="pg-card gift-item">
      {/* תמונת המתנה, אם קיימת */}
      <div className="pg-card__media">
        {gift.image ? (
          <img src={gift.image} alt={gift.name} className="pg-card__img" />
        ) : (
          <span className="pg-card__placeholder"><GiftIcon /></span>
        )}
        <span className="pg-card__score">{gift.category?.name || 'לא צוינה קטגוריה'}</span>
      </div>

      <div className="pg-card__body">
        {/* שם המתנה */}
        <h3 className="pg-card__title">{gift.name}</h3>

        {/* פרטי המתנה */}
        <p className="pg-card__text">{gift.description}</p>
        {gift.color && <span className="sgi-chip">צבע: {gift.color}</span>}

        <div className="pg-card__footer">
          <span className="pg-card__price">{gift.price} ₪</span>

          <div className="sgi-actions">
            {/* כפתור עריכה */}
            <button type="button" className="sgi-btn" onClick={() => onEdit(gift)}>
              <EditIcon />
              עריכה
            </button>

            {/* כפתור מחיקה */}
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