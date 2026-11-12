import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFeedback } from '../common/Feedback';
import { EditIcon, TrashIcon, PlusIcon, CheckIcon, CloseIcon } from '../common/Icons';

// כתובת בסיס השרת - יש לוודא שהפורט תואם לשרת ה-Node.js שלך (לדוגמה 7002 או 5000)
const API_BASE_URL = 'http://localhost:7002';

const MODULES = {
    CATEGORIES: { key: 'categories', label: 'קטגוריות', endpoint: `${API_BASE_URL}/api/category` },
    EVENTS: { key: 'events', label: 'אירועים', endpoint: `${API_BASE_URL}/api/event` },
    RELATIONSHIPS: { key: 'relationships', label: 'קרבה למקבל המתנה', endpoint: `${API_BASE_URL}/api/relationship` }
};

const MaintenanceManager = () => {
    const { toast, confirm } = useFeedback();
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
            toast(err.response?.data?.message || 'שגיאה בהוספת פריט (נדרשת הרשאת מנהל)', "error");
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
            toast(err.response?.data?.message || 'שגיאה בעדכון הפריט (נדרשת הרשאת מנהל)', "error");
        }
    };

    // 4. מחיקת פריט
  const handleDelete = async (id) => {
    const ok = await confirm({
        title: 'מחיקת פריט',
        message: 'האם למחוק פריט זה?',
        confirmText: 'מחיקה',
        cancelText: 'ביטול',
        danger: true
    });
    if (!ok) return;

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
        toast(err.response?.data?.message || 'שגיאה במחיקת הפריט', "error");
    }
};

    return (
        <section className="mm" dir="rtl">
            <header>
                <p className="pg-eyebrow">לוח ניהול</p>
                <h1 className="pg-title">ניהול ותחזוקת מערכת</h1>
                <p className="pg-sub">האפשרויות שהלקוחות והספקים בוחרים מהן בשאלון ובטופס המתנה.</p>
            </header>

            {/* סרגל כפתורי הניווט */}
            <div className="iq-tabs" role="group" aria-label="בחירת רשימה">
                {Object.values(MODULES).map((mod) => (
                    <button
                        key={mod.key}
                        type="button"
                        className={`iq-tab ${activeTab === mod.key ? 'iq-tab--on' : ''}`}
                        aria-pressed={activeTab === mod.key}
                        onClick={() => setActiveTab(mod.key)}
                    >
                        {mod.label}
                        {activeTab === mod.key && !loading && <span className="iq-tab__count">{items.length}</span>}
                    </button>
                ))}
            </div>

            <div className="mm-card">
                {/* טופס הוספה */}
                <form onSubmit={handleCreate} className="mm-add">
                    <label htmlFor="mmNewName" className="sr-only">שם חדש</label>
                    <input
                        id="mmNewName"
                        type="text"
                        placeholder={`הוספה ל${currentModule.label}...`}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type="submit" className="mm-add__btn">
                        <PlusIcon />
                        הוסף
                    </button>
                </form>

                {/* הצגת רשימת הנתונים */}
                {loading ? (
                    <p className="mm-state" role="status">טוען נתונים…</p>
                ) : error ? (
                    <p className="pg-error" role="alert">{error}</p>
                ) : (
                    <ul className="mm-list">
                        {Array.isArray(items) && items.length > 0 ? (
                            items.map((item) => (
                                <li key={item._id || item.id} className="mm-item">
                                    {editingId === (item._id || item.id) ? (
                                        <div className="mm-edit">
                                            <label htmlFor="mmEditName" className="sr-only">שם חדש</label>
                                            <input
                                                id="mmEditName"
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                autoFocus
                                            />
                                            <button type="button" className="sgi-btn mm-save" onClick={() => handleUpdate(item._id || item.id)}>
                                                <CheckIcon />
                                                שמירה
                                            </button>
                                            <button type="button" className="sgi-btn" onClick={() => setEditingId(null)} aria-label="ביטול">
                                                <CloseIcon />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="mm-item__name">{item.name}</span>
                                            <div className="sgi-actions">
                                                <button
                                                    type="button"
                                                    className="sgi-btn"
                                                    onClick={() => {
                                                        setEditingId(item._id || item.id);
                                                        setEditingName(item.name);
                                                    }}
                                                >
                                                    <EditIcon />
                                                    ערוך
                                                </button>
                                                <button
                                                    type="button"
                                                    className="sgi-btn sgi-btn--danger"
                                                    onClick={() => handleDelete(item._id || item.id)}
                                                    aria-label={`מחיקת ${item.name}`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="mm-state">לא נמצאו נתונים.</li>
                        )}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default MaintenanceManager