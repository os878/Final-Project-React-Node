import React, { useState, useEffect } from 'react';
import axios from 'axios';

// כתובת בסיס השרת - יש לוודא שהפורט תואם לשרת ה-Node.js שלך (לדוגמה 7002 או 5000)
const API_BASE_URL = 'http://localhost:7002';

const MODULES = {
    CATEGORIES: { key: 'categories', label: 'קטגוריות', endpoint: `${API_BASE_URL}/api/category` },
    EVENTS: { key: 'events', label: 'אירועים', endpoint: `${API_BASE_URL}/api/event` },
    RELATIONSHIPS: { key: 'relationships', label: 'קרבה למקבל המתנה', endpoint: `${API_BASE_URL}/api/relationship` }
};

const MaintenanceManager = () => {
    const [activeTab, setActiveTab] = useState(MODULES.CATEGORIES.key);
    const [items, setItems] = useState([]);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const currentModule = Object.values(MODULES).find(m => m.key === activeTab);

    // פונקציית עזר לקבלת ה-Headers עם טוקן המנהל
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token'); // או מכל מקום שבו שמור הטוקן אצלך
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    // 1. טעינת נתונים מהשרת
    const fetchItems = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(currentModule.endpoint, getAuthHeaders());
            
            if (Array.isArray(response.data)) {
                setItems(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setItems(response.data.data);
            } else {
                setItems([]);
            }
        } catch (err) {
            setItems([]);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('אין הרשאת מנהל לצפייה בנתונים אלו');
            } else if (err.response && err.response.status === 404) {
                setError('');
            } else {
                setError('שגיאה בטעינת הנתונים מהשרת');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        setNewName('');
        setEditingId(null);
    }, [activeTab]);

    // 2. הוספת פריט חדש
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            await axios.post(currentModule.endpoint, { name: newName }, getAuthHeaders());
            setNewName('');
            fetchItems();
        } catch (err) {
            alert(err.response?.data?.message || 'שגיאה בהוספת פריט (נדרשת הרשאת מנהל)');
        }
    };

    // 3. עדכון שם פריט
    const handleUpdate = async (id) => {
        if (!editingName.trim()) return;

        try {
            await axios.put(currentModule.endpoint, { id, name: editingName }, getAuthHeaders());
            setEditingId(null);
            setEditingName('');
            fetchItems();
        } catch (err) {
            alert(err.response?.data?.message || 'שגיאה בעדכון הפריט (נדרשת הרשאת מנהל)');
        }
    };

    // 4. מחיקת פריט
  const handleDelete = async (id) => {
    if (!window.confirm('האם למחוק פריט זה?')) return;

    try {
        // הוספת /delete לכל המודלים בהתאם להגדרות ה-Router בשרת
        const deleteUrl = `${currentModule.endpoint}/delete`;

        const token = localStorage.getItem('token');

        await axios.delete(deleteUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: { id }
        });
        
        fetchItems();
    } catch (err) {
        // הצגת הודעת השגיאה המדויקת שמוחזרת מהשרת (אם קיימת)
        alert(err.response?.data?.message || 'שגיאה במחיקת הפריט');
    }
};

    return (
        <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', direction: 'rtl' }}>
            <h2>ניהול ותחזוקת מערכת</h2>

            {/* סרגל כפתורי הניווט */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {Object.values(MODULES).map((mod) => (
                    <button
                        key={mod.key}
                        onClick={() => setActiveTab(mod.key)}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            backgroundColor: activeTab === mod.key ? '#007bff' : '#e0e0e0',
                            color: activeTab === mod.key ? '#fff' : '#000',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        {mod.label}
                    </button>
                ))}
            </div>

            {/* טופס הוספה */}
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder={`שם חדש...`}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    הוסף
                </button>
            </form>

            {/* הצגת רשימת הנתונים */}
            {loading ? (
                <p>טוען נתונים...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Array.isArray(items) && items.length > 0 ? (
                        items.map((item) => (
                            <li 
                                key={item._id || item.id} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    padding: '10px', 
                                    borderBottom: '1px solid #eee' 
                                }}
                            >
                                {editingId === (item._id || item.id) ? (
                                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            style={{ flex: 1, padding: '4px' }}
                                        />
                                        <button onClick={() => handleUpdate(item._id || item.id)}>שמירה</button>
                                        <button onClick={() => setEditingId(null)}>ביטול</button>
                                    </div>
                                ) : (
                                    <>
                                        <span>{item.name}</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => {
                                                    setEditingId(item._id || item.id);
                                                    setEditingName(item.name);
                                                }}
                                            >
                                                ערוך
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item._id || item.id)} 
                                                style={{ color: 'red' }}
                                            >
                                                מחק
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>לא נמצאו נתונים.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default MaintenanceManager