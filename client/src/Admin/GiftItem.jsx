import React from 'react';

const GiftItem = ({ gift, onDelete, onEdit }) => {

  const handleDelete = async () => {
    if (!window.confirm('האם את בטוחה שברצונך למחוק את המתנה?')) {
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
      alert(error.message);
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
    <div className="gift-item" style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
      <h3>{gift.name}</h3>

      <p><strong>מחיר:</strong> {gift.price} ₪</p>
      <p><strong>מיועד עבור:</strong> {gift.forGender || 'לא משנה'}</p>
      <p><strong>טווח גילאים:</strong> {gift.age1} - {gift.age2}</p>
      <p><strong>צבע:</strong> {gift.color}</p>
      <p><strong>תיאור:</strong> {gift.description || 'אין תיאור'}</p>

      {/* תצוגת שדות מקושרים */}
      <p><strong>קטגוריה:</strong> {getDisplayName(gift.category, 'לא צוינה קטגוריה')}</p>
      <p><strong>אירוע:</strong> {getDisplayName(gift.event, 'לא צוין אירוע')}</p>
      <p><strong>למי מיועד:</strong> {getDisplayName(gift.relationship, 'לא צוין קשר')}</p>

      <p><strong>אפשרות להקדשה אישית:</strong> {gift.DedicationPersonalization ? 'כן' : 'לא'}</p>

      {gift.styles && gift.styles.length > 0 && (
        <p><strong>סגנונות:</strong> {gift.styles.join(', ')}</p>
      )}

      {gift.image && (
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <img
            src={gift.image}
            alt={gift.name}
            width="150"
            style={{ borderRadius: '4px' }}
          />
        </div>
      )}

      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => onEdit(gift)}>
          עריכה
        </button>
        <button onClick={handleDelete}>
          מחיקה
        </button>
      </div>
    </div>
  );
};

export default GiftItem;