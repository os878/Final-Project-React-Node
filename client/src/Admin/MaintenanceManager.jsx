import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFeedback } from '../common/Feedback';
import { EditIcon, TrashIcon, PlusIcon, CheckIcon, CloseIcon, GiftIcon } from '../common/Icons';

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

    // אירועים: תמונה לדף הנחיתה ("לאיזה אירוע?") – המנהל בוחר מתנה מהאירוע, והתמונה שלה מוצגת
    const [gifts, setGifts] = useState([]);
    const [coverFor, setCoverFor] = useState(null); // id של האירוע שהבחירה שלו פתוחה
    const isEvents = activeTab === MODULES.EVENTS.key;

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
        setCoverFor(null);
    }, [activeTab]);

    // בלשונית האירועים – טוענים את המתנות (עם תמונה), כדי לבחור מהן תמונה לכל אירוע
    useEffect(() => {
        if (!isEvents || gifts.length) return;
        axios.get(`${API_BASE_URL}/api/gift/getAllGifts`)
            .then(({ data }) => setGifts((Array.isArray(data) ? data : []).filter((g) => g.image)))
            .catch(() => setGifts([]));
    }, [isEvents]);

    const giftsOfEvent = (eventId) =>
        gifts.filter((g) => (g.events || []).some((ev) => String(ev?._id || ev) === String(eventId)));
    const imageOf = (giftId) => gifts.find((g) => String(g._id) === String(giftId))?.image;

    // 5. בחירת תמונה לאירוע (giftId ריק = בחירה אוטומטית)
    const handleSetCover = async (eventId, giftId) => {
        try {
            await axios.patch(`${API_BASE_URL}/api/event/cover`, { id: eventId, giftId: giftId || null }, getAuthHeaders());
            setItems((list) => list.map((it) => ((it._id || it.id) === eventId ? { ...it, coverGift: giftId || null } : it)));
            setCoverFor(null);
            toast(giftId ? 'התמונה של האירוע עודכנה' : 'האירוע חזר לבחירה אוטומטית', 'success');
        } catch (err) {
            toast(err.response?.data?.message || 'שגיאה בעדכון תמונת האירוע', 'error');
        }
    };

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
                                                {isEvents && (
                                                    <button
                                                        type="button"
                                                        className="sgi-btn mm-cover-btn"
                                                        onClick={() => setCoverFor(coverFor === (item._id || item.id) ? null : (item._id || item.id))}
                                                        aria-expanded={coverFor === (item._id || item.id)}
                                                        title="התמונה של האירוע בדף הנחיתה"
                                                    >
                                                        {imageOf(item.coverGift)
                                                            ? <img src={imageOf(item.coverGift)} alt="" className="mm-cover-btn__img" />
                                                            : <GiftIcon />}
                                                        תמונה
                                                    </button>
                                                )}
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

                                            {/* בחירת תמונה לאירוע – מתוך המתנות של האירוע */}
                                            {isEvents && coverFor === (item._id || item.id) && (
                                                <div className="mm-cover" role="group" aria-label={`תמונה לאירוע ${item.name} בדף הנחיתה`}>
                                                    <p className="mm-cover__hint">
                                                        בחרו מתנה מהאירוע – התמונה שלה תוצג באריח "{item.name}" בדף הנחיתה.
                                                    </p>
                                                    {giftsOfEvent(item._id || item.id).length === 0 ? (
                                                        <p className="mm-cover__hint">עוד אין לאירוע הזה מתנות עם תמונה.</p>
                                                    ) : (
                                                        <div className="mm-cover__grid">
                                                            {giftsOfEvent(item._id || item.id).map((g) => (
                                                                <button
                                                                    key={g._id}
                                                                    type="button"
                                                                    className={`mm-cover__opt ${String(item.coverGift) === String(g._id) ? 'mm-cover__opt--on' : ''}`}
                                                                    aria-pressed={String(item.coverGift) === String(g._id)}
                                                                    onClick={() => handleSetCover(item._id || item.id, g._id)}
                                                                >
                                                                    <img src={g.image} alt="" />
                                                                    <span>{g.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {item.coverGift && (
                                                        <button type="button" className="mm-cover__auto" onClick={() => handleSetCover(item._id || item.id, null)}>
                                                            חזרה לבחירה אוטומטית
                                                        </button>
                                                    )}
                                                </div>
                                            )}
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