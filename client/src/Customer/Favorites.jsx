import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

// ===== חדש: אייקונים =====
const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
);
const GiftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="10" width="16" height="10" rx="1.5" />
        <path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" />
    </svg>
);
const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
    </svg>
);

const Favorites = () => {

    // רשימת המתנות האהובות של הלקוח
    const [favorites, setFavorites] = useState([]);

    // מצב טעינה
    const [loading, setLoading] = useState(true);

    // הודעת שגיאה
    const [errorMessage, setErrorMessage] = useState('');

    // שליפת המתנות האהובות מהשרת
    useEffect(() => {
        const getFavorites = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await Axios.get(
                    'http://localhost:7002/api/favorite',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setFavorites(response.data);

            }
            catch (error) {
                setErrorMessage('לא ניתן לטעון את המתנות האהובות');
            } finally {
                setLoading(false);
            }
        };

        getFavorites();
    }, []);


    // הסרת מתנה מהמועדפים
    const handleRemoveFavorite = async (giftId) => {
        try {
            const token = localStorage.getItem('token');

            await Axios.delete(
                `http://localhost:7002/api/favorite/${giftId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // עדכון הרשימה בקליינט לאחר ההסרה
            setFavorites(
                favorites.filter(
                    favorite => favorite.gift?._id !== giftId
                )
            );

        } catch (error) {
            setErrorMessage('לא ניתן להסיר את המתנה מהמועדפים');
        }
    };


    // בזמן טעינת הנתונים
    if (loading) {
        return <p className="gd-state" role="status">טוען מתנות אהובות…</p>;
    }

    // הצגת שגיאה
    if (errorMessage) {
        return <p className="gd-state gd-state--error" role="alert">{errorMessage}</p>;
    }

    // אם אין מתנות אהובות
    if (favorites.length === 0) {
        return (
            <div className="pg-empty" dir="rtl">
                <span className="pg-empty__icon"><HeartIcon /></span>
                <h2>עדיין לא שמרת מתנות במועדפים</h2>
                <p>כשמוצאים מתנה שאוהבים, לוחצים על הלב והיא נשמרת כאן.</p>
                <Link to="/Customer/Questionnaire" className="pg-btn">למצוא מתנה</Link>
            </div>
        );
    }


    return (
        <section className="pg" dir="rtl">

            <header className="pg-head">
                <p className="pg-eyebrow">המועדפים שלי</p>
                <h1 className="pg-title">המתנות האהובות שלי</h1>
                <p className="pg-sub">
                    {favorites.length === 1 ? 'מתנה אחת שמורה' : `${favorites.length} מתנות שמורות`}. לחיצה על הלב מסירה מהרשימה.
                </p>
            </header>

            <div className="pg-grid">
                {favorites.map(favorite => {

                    const gift = favorite.gift;

                    // אם המתנה נמחקה מהמערכת
                    if (!gift) {
                        return null;
                    }

                    return (
                        <article key={favorite._id} className="pg-card">

                            <div className="pg-card__media">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="pg-card__img" />
                                ) : (
                                    <span className="pg-card__placeholder"><GiftIcon /></span>
                                )}

                                <button
                                    type="button"
                                    className="pg-fav pg-fav--on"
                                    onClick={() =>
                                        handleRemoveFavorite(gift._id)
                                    }
                                    aria-label={`הסרה מהמועדפים: ${gift.name}`}
                                >
                                    <HeartIcon />
                                </button>
                            </div>

                            <div className="pg-card__body">
                                <h2 className="pg-card__title">{gift.name}</h2>
                                <p className="pg-card__text">{gift.description}</p>

                                <div className="pg-card__footer">
                                    <span className="pg-card__price">{gift.price} ₪</span>
                                    <Link to={`/Customer/GiftDetails/${gift._id}`} className="pg-card__link">
                                        לפרטים נוספים
                                        <ArrowIcon />
                                    </Link>
                                </div>
                            </div>

                        </article>
                    );
                })}
            </div>

        </section>
    );
};

export default Favorites;