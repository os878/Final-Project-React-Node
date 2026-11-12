import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import GiftItem from './GiftItem';
import AddGift from './AddGift';

const GiftsList = () => {
    // מערך המתנות שנקבל מהשרת
    const [gifts, setGifts] = useState([]);
    // המתנה שנבחרה לעריכה
    const [selectedGift, setSelectedGift] = useState(null);
    // האם חלון העריכה פתוח
    const [isEditOpen, setIsEditOpen] = useState(false);
    // משתנה לשמירת הודעת שגיאה
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // פונקציה שמביאה את המתנות מהשרת
    const getGifts = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('יש להתחבר למערכת כדי לראות את המתנות');
                return;
            }

            // שליחת בקשת GET באמצעות Axios עם ה-Token ב-Header
            const response = await Axios.get('http://localhost:7002/api/gift/findByIdSupplier', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Axios מחזיר את הנתונים המפוענחים ישירות ב-response.data
            setGifts(Array.isArray(response.data) ? response.data : []);
            setError('');
        } catch (err) {
            // טיפול בשגיאות ותמיכה במקרה שהשרת מחזיר 404 כשאין מתנות
            if (err.response && err.response.status === 404) {
                setGifts([]);
                setError('');
            } else {
                setError(err.response?.data?.message || 'לא הצלחנו לטעון את המתנות');
            }
        }
    };

    useEffect(() => {
        getGifts();
    }, []);

    // הסרת מתנה מהתצוגה לפי המזהה שלה
    const removeGift = (giftId) => {
        setGifts((prevGifts) =>
            prevGifts.filter((gift) => gift._id !== giftId)
        );
    };

    // פתיחת חלון העריכה עבור המתנה שנבחרה
    const openEdit = (gift) => {
        setSelectedGift(gift);
        setIsEditOpen(true);
    };

    // סגירת חלון העריכה
    const closeEdit = () => {
        setIsEditOpen(false);
        setSelectedGift(null);
    };

    // עדכון המתנה ברשימה לאחר שמירה מוצלחת
    const updateGiftInList = (updatedGift) => {
        setGifts((prevGifts) =>
            prevGifts.map((item) =>
                item._id === updatedGift._id ? updatedGift : item
            )
        );
        closeEdit();
        getGifts();
    };

    return (
        <section className="sg" dir="rtl">
            <header className="sg-head">
                <div>
                    <p className="pg-eyebrow">אזור הספקים</p>
                    <h1 className="pg-title">המתנות שלי</h1>
                    <p className="pg-sub">
                        {gifts.length > 0 ? `${gifts.length} מוצרים באתר` : 'כאן יופיעו המוצרים שתעלו'}
                    </p>
                </div>

                {/* כפתור מעבר לעמוד הוספת מתנה */}
                <button type="button" className="sg-add" onClick={() => navigate('/AddGift')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    הוספת מתנה חדשה
                </button>
            </header>

            {/* הצגת הודעת שגיאה, אם קיימת */}
            {error && <p className="pg-error" role="alert">{error}</p>}

            {/* מעבר על כל המתנות והצגת קומפוננטה לכל מתנה */}
            {gifts.length > 0 && (
                <div className="sg-grid">
                    {gifts.map((gift) => (
                        <GiftItem
                            key={gift._id}
                            gift={gift}
                            onDelete={removeGift}
                            onEdit={openEdit}
                        />
                    ))}
                </div>
            )}

            {/* חלון עריכת מתנה */}
            {isEditOpen && selectedGift && (
                <div className="gd-overlay" onClick={closeEdit}>
                    <div className="gd-dialog" role="dialog" aria-modal="true" aria-label="עריכת מתנה" onClick={(e) => e.stopPropagation()}>
                        <div className="gd-dialog__head">
                            <div>
                                <h2 className="gd-dialog__title">עריכת מתנה</h2>
                                <p className="gd-dialog__sub">{selectedGift.name}</p>
                            </div>
                            {/* כפתור לסגירת החלון */}
                            <button type="button" className="gd-dialog__close" onClick={closeEdit} aria-label="סגירה">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6 6 18" />
                                </svg>
                            </button>
                        </div>

                        {/* טופס העריכה עם פרטי המתנה שנבחרה */}
                        <AddGift
                            gift={selectedGift}
                            onUpdated={updateGiftInList}
                        />
                    </div>
                </div>
            )}

            {/* הודעה אם עדיין אין מתנות להצגה */}
            {gifts.length === 0 && !error && (
                <div className="pg-empty">
                    <span className="pg-empty__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="4" y="10" width="16" height="10" rx="1.5" />
                            <path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" />
                        </svg>
                    </span>
                    <h2>אין עדיין מתנות להצגה</h2>
                    <p>מעלים מוצר ראשון, והוא יתחיל להופיע ללקוחות שמחפשים בדיוק אותו.</p>
                    <button type="button" className="sg-add" onClick={() => navigate('/AddGift')}>
                        הוספת מתנה ראשונה
                    </button>
                </div>
            )}
        </section>
    );
};

export default GiftsList;