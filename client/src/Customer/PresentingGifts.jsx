import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { GiftContext } from '../context/GiftContext';
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
            <div dir="rtl">
                <p>לא ניתן להציג את המתנות. יש לחפש מתנות דרך השאלון.</p>
                <Link to="/Customer/Questionnaire">חזרה לשאלון</Link>
            </div>
        );
    }

    if (matchingGifts.length === 0) {
        return <p>לא נמצאו מתנות מתאימות</p>;
    }

    return (
        <div dir="rtl">
            <h2>המתנות המתאימות עבורך</h2>
            {favoritesError && <p role="alert">{favoritesError}</p>}

            {matchingGifts.map(result => {
                const gift = result.gift;

                return (
                    <div key={gift._id}>
                        <h3>{gift.name}</h3>

                        {gift.image && (
                            <img
                                src={gift.image}
                                alt={gift.name}
                                width="150"
                            />
                        )}

                        <p>{gift.description}</p>
                        <p>מחיר: {gift.price} ₪</p>
                        <p>אחוז התאמה: {result.score}%</p>
                        <button onClick={() => handleToggleFavorite(gift._id)} aria-label="עדכון מועדפים">
                            {favorites.some(favorite => favorite.gift?._id === gift._id)
                                ? '❤️'
                                : '♡'}
                        </button>
                        <Link to={`/Customer/GiftDetails/${gift._id}`}>
                            לפרטים נוספים
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default PresentingGifts;