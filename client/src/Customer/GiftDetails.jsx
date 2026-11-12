import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';

// ===== חדש: אייקונים =====
const Icon = ({ children, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);
const GiftIcon = (p) => <Icon {...p}><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" /></Icon>;
const StoreIcon = (p) => <Icon {...p}><path d="M4 10v10h16V10" /><path d="M3 10 5 4h14l2 6Z" /><path d="M10 20v-5h4v5" /></Icon>;
const ChatIcon = (p) => <Icon {...p}><path d="M4 5h16v11H9l-5 4Z" /><path d="M8 9h8M8 12h5" /></Icon>;
const BackIcon = (p) => <Icon {...p}><path d="M5 12h14m0 0-7-7m7 7-7 7" /></Icon>;
const CloseIcon = (p) => <Icon {...p}><path d="M6 6l12 12M18 6 6 18" /></Icon>;
const WhatsAppIcon = (p) => <Icon {...p}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-1.6-1-2-2l1-1-1-2Z" /></Icon>;
const PhoneIcon = (p) => <Icon {...p}><path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></Icon>;
const MailIcon = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>;

// אפשרויות החזרה – אותם ערכים בדיוק כמו ב-select הקודם
const CONTACT_OPTIONS = [
    { value: 'WhatsApp', label: 'WhatsApp', Icon: WhatsAppIcon },
    { value: 'Phone', label: 'טלפון', Icon: PhoneIcon },
    { value: 'Email', label: 'מייל', Icon: MailIcon },
];

const SUCCESS_MESSAGE = 'הפנייה נשלחה בהצלחה!';

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

            setSubmitMessage(SUCCESS_MESSAGE);
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

    // ===== חדש: סגירת החלון מנקה גם את הודעת השליחה =====
    const closeDialog = () => {
        setOpenDialog(false);
        setSubmitMessage('');
    };

    if (loading) return <p className="gd-state" role="status">טוען פרטי מתנה…</p>;
    if (error) return <p className="gd-state gd-state--error" role="alert">{error}</p>;
    if (!gift) return <p className="gd-state">המתנה לא נמצאה</p>;

    const isSuccess = submitMessage === SUCCESS_MESSAGE;

    return (
        <section className="gd" dir="rtl">
            <Link to="/PresentingGifts" className="gd-back">
                <BackIcon className="gd-back__icon" />
                חזרה לתוצאות
            </Link>

            <div className="gd-main">
                <div className="gd-media">
                    {gift.image ? (
                        <img src={gift.image} alt={gift.name} className="gd-media__img" />
                    ) : (
                        <span className="gd-media__placeholder"><GiftIcon /></span>
                    )}
                </div>

                <div className="gd-info">
                    <h1 className="gd-title">{gift.name}</h1>
                    <p className="gd-price">{gift.price} ₪</p>
                    <p className="gd-text">{gift.description}</p>

                    <div className="gd-supplier">
                        <span className="gd-supplier__icon"><StoreIcon /></span>
                        <div>
                            <span className="gd-supplier__label">פרטי הספק</span>
                            <strong className="gd-supplier__name">{gift.supplier?.companyName}</strong>
                        </div>
                    </div>

                    <button type="button" className="gd-cta" onClick={() => setOpenDialog(true)}>
                        <ChatIcon className="gd-cta__icon" />
                        שליחת פנייה לספק
                    </button>
                    <p className="gd-note">הספק יחזור אליכם בדרך שתבחרו, כדי לתאם הזמנה או לענות על שאלות.</p>
                </div>
            </div>

            {openDialog && (
                <div className="gd-overlay" onClick={closeDialog}>
                    <div className="gd-dialog" role="dialog" aria-modal="true" aria-labelledby="gdDialogTitle" onClick={(e) => e.stopPropagation()}>
                        <div className="gd-dialog__head">
                            <div>
                                <h2 id="gdDialogTitle" className="gd-dialog__title">פנייה לספק</h2>
                                <p className="gd-dialog__sub">בנוגע ל: {gift.name}</p>
                            </div>
                            <button type="button" className="gd-dialog__close" onClick={closeDialog} aria-label="סגירה">
                                <CloseIcon />
                            </button>
                        </div>

                        <form className="gd-form" onSubmit={handleSubmit}>
                            <div className="gd-form__row">
                                <div className="gd-form__field">
                                    <label htmlFor="gdName">שם מלא</label>
                                    <input id="gdName" type="text" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="gd-form__field">
                                    <label htmlFor="gdPhone">מספר טלפון</label>
                                    <input id="gdPhone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="gd-form__field">
                                <label htmlFor="gdEmail">כתובת מייל <small>(לא חובה)</small></label>
                                <input id="gdEmail" type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="gd-form__field">
                                <label htmlFor="gdMessage">הודעה לספק</label>
                                <textarea id="gdMessage" name="message" rows="4" placeholder="למשל: אשמח לדעת אם אפשר להוסיף הקדשה, ותוך כמה זמן זה מגיע"
                                    value={formData.message} onChange={handleChange} required />
                            </div>

                            <fieldset className="gd-contact">
                                <legend>איך תרצו שהספק יחזור אליכם?</legend>
                                <div className="gd-contact__options">
                                    {CONTACT_OPTIONS.map(({ value, label, Icon: OptionIcon }) => (
                                        <label key={value} className={`gd-contact__option ${formData.preferredContact === value ? 'gd-contact__option--on' : ''}`}>
                                            <input type="radio" name="preferredContact" value={value}
                                                checked={formData.preferredContact === value} onChange={handleChange} />
                                            <OptionIcon className="gd-contact__icon" />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {submitMessage && (
                                <p className={`gd-msg ${isSuccess ? 'gd-msg--ok' : 'gd-msg--error'}`} role="alert">{submitMessage}</p>
                            )}

                            <div className="gd-form__actions">
                                <button type="submit" className="gd-cta" disabled={submitting}>
                                    {submitting ? 'שולח…' : 'שליחת פנייה'}
                                </button>
                                <button type="button" className="gd-cancel" onClick={closeDialog}>
                                    {isSuccess ? 'סגירה' : 'ביטול'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default GiftDetails;