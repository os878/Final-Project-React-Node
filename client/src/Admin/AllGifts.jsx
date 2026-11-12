import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GiftItem from './GiftItem'
import UpdateGift from './UpdateGift'
import { CloseIcon } from '../common/Icons';

const AllGifts = () => {
    // מערך המתנות שנקבל מהשרת
    const [gifts, setGifts] = useState([]);
    // המתנה שנבחרה לעריכה
    const [selectedGift, setSelectedGift] = useState(null);

    // האם חלון העריכה פתוח
    const [isEditOpen, setIsEditOpen] = useState(false);

    // משתנה לשמירת הודעת שגיאה, אם תהיה
    const [error, setError] = useState('');

    // useEffect מריץ את הבקשה כאשר הקומפוננטה נטענת
    useEffect(() => {
        // פונקציה שמביאה את המתנות מהשרת
        const getGifts = async () => {
            try {
                // קוראים את הטוקן ששמרנו בזמן ההתחברות
                const token = localStorage.getItem('token');

                // אם אין טוקן, לא ניתן לבצע בקשה מזוהה
                if (!token) {
                    setError('יש להתחבר למערכת כדי לראות את המתנות');
                    return;
                }

                // שליחת בקשת GET לשרת עם הטוקן
                const response = await fetch('http://localhost:7002/api/gift/getAllGifts', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // בדיקה אם השרת החזיר שגיאה
                if (!response.ok) {
                    throw new Error('לא הצלחנו לטעון את המתנות');
                }

                // ממירים את התשובה מהשרת לנתוני JavaScript
                const data = await response.json();

                // שומרים את המתנות במערך
                setGifts(data);
            } catch (err) {
                // טיפול בשגיאה והצגתה במסך
                setError(err.message);
            }
        };

        // הפעלת הפונקציה
        getGifts();
    }, []);
    // הסרת מתנה מהתצוגה לפי המזהה שלה
    const removeGift = (giftId) => {
        setGifts((prevGifts) =>
            prevGifts.filter((gift) => gift._id !== giftId)
        )
    }
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
    };
    return (
        <section className="sg" dir="rtl">
            <header className="sg-head">
                <div>
                    <p className="pg-eyebrow">לוח ניהול</p>
                    <h1 className="pg-title">ניהול מתנות</h1>
                    <p className="pg-sub">{gifts.length > 0 ? `${gifts.length} מתנות באתר, מכל הספקים` : 'אין עדיין מתנות להצגה'}</p>
                </div>
            </header>

            {/* הצגת הודעת שגיאה */}
            {error && <p className="pg-error" role="alert">{error}</p>}

            {/* מעבר על כל הפריטים והצגתם */}
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

            {/* חלון עריכה */}
            {isEditOpen && selectedGift && (
                <div className="gd-overlay" onClick={closeEdit}>
                    <div className="gd-dialog" role="dialog" aria-modal="true" aria-label="עריכת מתנה" onClick={(e) => e.stopPropagation()}>
                        <div className="gd-dialog__head">
                            <div>
                                <h2 className="gd-dialog__title">עריכת מתנה</h2>
                                <p className="gd-dialog__sub">{selectedGift.name}</p>
                            </div>
                            <button type="button" className="gd-dialog__close" onClick={closeEdit} aria-label="סגירה">
                                <CloseIcon />
                            </button>
                        </div>

                        <UpdateGift
                            gift={selectedGift}
                            onUpdated={updateGiftInList}
                        />
                    </div>
                </div>
            )}

            {/* הודעה אם אין מה להציג */}
            {gifts.length === 0 && !error && (
                <div className="pg-empty">
                    <h2>אין עדיין מתנות להצגה</h2>
                </div>
            )}
        </section>
    );
};

export default AllGifts;