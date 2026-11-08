
import { useEffect, useState } from 'react';
import Axios from 'axios';

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
        return <p>טוען מתנות אהובות...</p>;
    }

    // הצגת שגיאה
    if (errorMessage) {
        return <p>{errorMessage}</p>;
    }

    // אם אין מתנות אהובות
    if (favorites.length === 0) {
        return <p>עדיין לא שמרת מתנות במועדפים</p>;
    }


    return (
        <div dir="rtl">

            <h2>המתנות האהובות שלי ❤️</h2>

            <div>
                {favorites.map(favorite => {

                    const gift = favorite.gift;

                    // אם המתנה נמחקה מהמערכת
                    if (!gift) {
                        return null;
                    }

                    return (
                        <div key={favorite._id}>

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

                            <button
                                onClick={() =>
                                    handleRemoveFavorite(gift._id)
                                }
                            >
                                הסרה מהמועדפים
                            </button>

                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Favorites;
