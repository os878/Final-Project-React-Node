import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';

const GiftDetails = () => {
    const { id } = useParams();

    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        preferredContact: 'WhatsApp'
    });

    const [submitMessage, setSubmitMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setSubmitMessage('יש להתחבר למערכת כדי לשלוח פנייה');
            return;
        }
        setSubmitting(true);
        setSubmitMessage('');

        try {
            await Axios.post(
                'http://localhost:7002/api/inquiry',
                {
                    giftId: id,
                    ...formData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSubmitMessage('הפנייה נשלחה בהצלחה!');
            setFormData({
                name: '',
                phone: '',
                email: '',
                message: '',
                preferredContact: 'WhatsApp'
            });

        } catch (error) {
            console.error('שגיאה בשליחת הפנייה:', error);
            setSubmitMessage(
                error.response?.data?.message || 'לא ניתן לשלוח את הפנייה'
            );
        } finally {
            setSubmitting(false);
        }
    };
    useEffect(() => {
        const fetchGift = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await Axios.get(
                    `http://localhost:7002/api/gift/findByIdGift/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setGift(response.data);
            } catch (error) {
                console.error('שגיאה בטעינת המתנה:', error);
                setError(
                    error.response?.data?.message || 'לא ניתן לטעון את פרטי המתנה'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGift();
    }, [id]);

    if (loading) return <p>טוען פרטי מתנה...</p>;
    if (error) return <p>{error}</p>;
    if (!gift) return <p>המתנה לא נמצאה</p>;

    return (
        <div dir="rtl">
            <h2>{gift.name}</h2>

            {gift.image && (
                <img
                    src={gift.image}
                    alt={gift.name}
                    width="250"
                />
            )}

            <p>{gift.description}</p>
            <p>מחיר: {gift.price} ₪</p>

            <h3>פרטי הספק</h3>
            <p>{gift.supplier?.companyName}</p>
            <button onClick={() => setOpenDialog(true)}>
                שליחת פנייה לספק
            </button>
            {openDialog && (
                <div dir="rtl">
                    <h2>פנייה לספק</h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="name"
                            placeholder="שם מלא"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="מספר טלפון"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="כתובת מייל"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <textarea
                            name="message"
                            placeholder="הודעה לספק"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        <label>איך תרצה שהספק יחזור אליך?</label>

                        <select
                            name="preferredContact"
                            value={formData.preferredContact}
                            onChange={handleChange}
                        >
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Phone">טלפון</option>
                            <option value="Email">מייל</option>
                        </select>

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'שולח...' : 'שליחת פנייה'}
                        </button>

                        {submitMessage && <p>{submitMessage}</p>}

                    </form>
                    <button onClick={() => setOpenDialog(false)}>
                        ביטול
                    </button>
                </div>
            )}
        </div>
    );
};

export default GiftDetails;