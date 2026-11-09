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
        <div>
            <h2>המתנות שלי</h2>

            {/* כפתור מעבר לעמוד הוספת מתנה */}
            <button onClick={() => navigate('/AddGift')}>
                הוספת מתנה חדשה
            </button>

            {/* הצגת הודעת שגיאה, אם קיימת */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* מעבר על כל המתנות והצגת קומפוננטה לכל מתנה */}
            {gifts.map((gift) => (
                <GiftItem
                    key={gift._id}
                    gift={gift}
                    onDelete={removeGift}
                    onEdit={openEdit}
                />
            ))}

            {/* חלון עריכת מתנה */}
            {isEditOpen && selectedGift && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            width: '500px',
                            maxWidth: '90%'
                        }}
                    >
                        {/* כפתור לסגירת החלון */}
                        <button onClick={closeEdit}>
                            סגירה ✕
                        </button>

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
                <p>אין עדיין מתנות להצגה</p>
            )}
        </div>
    );
};

export default GiftsList;