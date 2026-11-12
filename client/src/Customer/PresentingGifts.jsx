import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { GiftContext } from '../context/GiftContext';

// ===== חדש: אייקונים (במקום האימוג'י ❤️ / ♡) =====
const HeartIcon = ({ filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

const PresentingGifts = () => {
    const location = useLocation();
    const [favorites, setFavorites] = useState([]);
    const { matchingGifts } = useContext(GiftContext);
    const [favoritesError, setFavoritesError] = useState('');


    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setFavoritesError('יש להתחבר למערכת כדי לטעון מועדפים');
                return;
            }

            try {
                const response = await Axios.get('http://localhost:7002/api/favorite', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!Array.isArray(response.data)) {
                    throw new Error('השרת החזיר רשימת מועדפים לא תקינה');
                }
                setFavorites(response.data);
            } catch (error) {
                console.error('שגיאה בטעינת המועדפים:', error);
                setFavoritesError(error.response?.data?.message || error.message || 'לא ניתן לטעון את המתנות האהובות');
            }
        };

        fetchFavorites();
    }, []);

    const handleToggleFavorite = async (giftId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setFavoritesError('יש להתחבר למערכת כדי לשמור מתנות במועדפים');
            return;
        }

        try {
            const isFavorite = favorites.some(favorite => favorite.gift?._id === giftId);
            if (isFavorite) {
                await Axios.delete(`http://localhost:7002/api/favorite/${giftId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavorites(prev => prev.filter(favorite => favorite.gift?._id !== giftId));
            } else {
                const response = await Axios.post('http://localhost:7002/api/favorite', { giftId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavorites(prev => [
                    ...prev,
                    { _id: response.data?.favorite?._id, gift: { _id: giftId } }
                ]);
            }
            setFavoritesError('');
        } catch (error) {
            console.error('שגיאה בעדכון המועדפים:', error);
            setFavoritesError(error.response?.data?.message || error.message || 'שגיאה בעדכון המועדפים');
        }
    };

    if (matchingGifts === null) {
        return (
            <div className="pg-empty" dir="rtl">
                <span className="pg-empty__icon"><GiftIcon /></span>
                <h2>עוד לא חיפשתם מתנות</h2>
                <p>לא ניתן להציג את המתנות. יש לחפש מתנות דרך השאלון.</p>
                <Link to="/Customer/Questionnaire" className="pg-btn">חזרה לשאלון</Link>
            </div>
        );
    }

    if (matchingGifts.length === 0) {
        return (
            <div className="pg-empty" dir="rtl">
                <span className="pg-empty__icon"><GiftIcon /></span>
                <h2>לא נמצאו מתנות מתאימות</h2>
                <p>אפשר לנסות לשנות חלק מהתשובות, למשל להגדיל את התקציב או לבחור תחום אחר.</p>
                <Link to="/Customer/Questionnaire" className="pg-btn">לשנות תשובות בשאלון</Link>
            </div>
        );
    }

    return (
        <section className="pg" dir="rtl">
            <header className="pg-head">
                <p className="pg-eyebrow">מתנות מספקים</p>
                <h1 className="pg-title">המתנות המתאימות עבורך</h1>
                <p className="pg-sub">מסודרות מהמתאימה ביותר. אהבתם משהו? שמרו אותו במועדפים.</p>
            </header>

            {favoritesError && <p className="pg-error" role="alert">{favoritesError}</p>}

            <div className="pg-grid">
                {matchingGifts.map(result => {
                    const gift = result.gift;
                    const isFavorite = favorites.some(favorite => favorite.gift?._id === gift._id);

                    return (
                        <article key={gift._id} className="pg-card">
                            <div className="pg-card__media">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="pg-card__img" />
                                ) : (
                                    <span className="pg-card__placeholder"><GiftIcon /></span>
                                )}

                                <span className="pg-card__score">התאמה <bdi>{result.score}%</bdi></span>

                                <button
                                    type="button"
                                    className={`pg-fav ${isFavorite ? 'pg-fav--on' : ''}`}
                                    onClick={() => handleToggleFavorite(gift._id)}
                                    aria-label={isFavorite ? 'הסרה מהמועדפים' : 'הוספה למועדפים'}
                                    aria-pressed={isFavorite}
                                >
                                    <HeartIcon filled={isFavorite} />
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

export default PresentingGifts;