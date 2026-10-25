
import React from 'react';

const GiftItem = ({ gift, onDelete,onEdit  }) => {

  const handleDelete = async () => {


    if (!window.confirm('האם את בטוחה שברצונך למחוק את המתנה?')) {
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
      alert(error.message);
    }
  };
  return (
    <div className="gift-item">
      {/* שם המתנה */}
      <h3>{gift.name}</h3>

      {/* פרטי המתנה */}
      <p>מחיר: {gift.price} ₪</p>
      <p>צבע: {gift.color}</p>
      <p>תיאור: {gift.description}</p>
      <p>קטגוריה: {gift.category?.name || 'לא צוינה קטגוריה'}</p>

      {/* תמונת המתנה, אם קיימת */}
      {gift.image && (
        <img
          src={gift.image}
          alt={gift.name}
          width="150"
        />
      )}

      {/* כפתור עריכה */}
      <button onClick={() => onEdit(gift)}>
        עריכה
      </button>

      {/* כפתור מחיקה */}
      <button onClick={handleDelete}>
        מחיקה
      </button>
    </div>
  );
};

export default GiftItem;
