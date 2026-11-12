import { useEffect, useState } from 'react';
import Axios from 'axios';

// ===== חדש: תצוגה =====
const Icon = ({ children, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);
const PhoneIcon = (p) => <Icon {...p}><path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></Icon>;
const MailIcon = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>;
const WhatsAppIcon = (p) => <Icon {...p}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-1.6-1-2-2l1-1-1-2Z" /></Icon>;
const GiftIcon = (p) => <Icon {...p}><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" /></Icon>;
const ChatIcon = (p) => <Icon {...p}><path d="M4 5h16v11H9l-5 4Z" /><path d="M8 9h8M8 12h5" /></Icon>;

// הערכים נשארים כמו בשרת (New / InProgress / Handled), רק התצוגה בעברית
const STATUSES = [
    { value: 'New', label: 'פנייה חדשה', short: 'חדשות' },
    { value: 'InProgress', label: 'בטיפול', short: 'בטיפול' },
    { value: 'Handled', label: 'טופלה', short: 'טופלו' },
];
const statusLabel = (value) => STATUSES.find((s) => s.value === value)?.label || value;

const CONTACT_LABELS = { WhatsApp: 'WhatsApp', Phone: 'טלפון', Email: 'מייל' };

// מספר ישראלי (050...) → פורמט בינלאומי לקישור WhatsApp (97250...)
const whatsappLink = (phone) => {
    const digits = (phone || '').replace(/\D/g, '');
    const intl = digits.startsWith('0') ? `972${digits.slice(1)}` : digits;
    return `https://wa.me/${intl}`;
};

const SupplierInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // חדש: סינון לפי סטטוס (רק תצוגה, לא משנה כלום בשרת)
    const [filter, setFilter] = useState('All');
    const handleStatusChange = async (inquiryId, newStatus) => {
        const token = localStorage.getItem('token');

        try {
            await Axios.patch(
                `http://localhost:7002/api/inquiry/${inquiryId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setInquiries(prev =>
                prev.map(inquiry =>
                    inquiry._id === inquiryId
                        ? { ...inquiry, status: newStatus }
                        : inquiry
                )
            );

        } catch (error) {
            console.error('שגיאה בעדכון סטטוס:', error);
            setError(error.response?.data?.message || 'לא ניתן לעדכן את הסטטוס');
        }
    };
    useEffect(() => {
        const fetchInquiries = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await Axios.get(
                    'http://localhost:7002/api/inquiry/supplier',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setInquiries(response.data);
                console.log('הפניות שהתקבלו:', response.data);

            } catch (error) {
                console.error('שגיאה בטעינת הפניות:', error);
                setError(
                    error.response?.data?.message || 'לא ניתן לטעון את הפניות'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    if (loading) return <p className="gd-state" role="status">טוען פניות…</p>;
    if (error) return <p className="gd-state gd-state--error" role="alert">{error}</p>;

    const countOf = (status) => inquiries.filter((i) => i.status === status).length;
    const shown = filter === 'All' ? inquiries : inquiries.filter((i) => i.status === filter);
    const newCount = countOf('New');

    return (
        <section className="iq" dir="rtl">
            <header className="iq-head">
                <p className="pg-eyebrow">אזור הספקים</p>
                <h1 className="pg-title">פניות לקוחות</h1>
                <p className="pg-sub">
                    {newCount === 0 ? 'אין פניות חדשות שמחכות לתשובה' : newCount === 1 ? 'יש לך פנייה חדשה אחת שמחכה לתשובה' : `יש לך ${newCount} פניות חדשות שמחכות לתשובה`}
                </p>
            </header>

            {inquiries.length === 0 ? (
                <div className="pg-empty">
                    <span className="pg-empty__icon"><ChatIcon /></span>
                    <h2>עדיין לא התקבלו פניות</h2>
                    <p>כשלקוח ישלח פנייה על אחד המוצרים שלך, היא תופיע כאן.</p>
                </div>
            ) : (
                <>
                    {/* סינון לפי סטטוס */}
                    <div className="iq-tabs" role="group" aria-label="סינון פניות">
                        {[{ value: 'All', short: 'הכל' }, ...STATUSES].map((s) => (
                            <button
                                key={s.value}
                                type="button"
                                className={`iq-tab ${filter === s.value ? 'iq-tab--on' : ''}`}
                                aria-pressed={filter === s.value}
                                onClick={() => setFilter(s.value)}
                            >
                                {s.short}
                                <span className="iq-tab__count">{s.value === 'All' ? inquiries.length : countOf(s.value)}</span>
                            </button>
                        ))}
                    </div>

                    {shown.length === 0 && <p className="iq-none">אין פניות בסטטוס הזה.</p>}

                    <div className="iq-list">
                        {shown.map(inquiry => (
                            <article key={inquiry._id} className={`iq-card iq-card--${inquiry.status}`}>
                                <div className="iq-card__top">
                                    <div className="iq-card__gift">
                                        <span className="iq-card__gift-icon"><GiftIcon /></span>
                                        <div>
                                            <span className="iq-card__label">פנייה עבור</span>
                                            <h2 className="iq-card__title">{inquiry.gift?.name}</h2>
                                        </div>
                                    </div>
                                    <div className="iq-card__meta">
                                        <span className={`iq-badge iq-badge--${inquiry.status}`}>{statusLabel(inquiry.status)}</span>
                                        <time className="iq-card__date" dateTime={inquiry.createdAt}>
                                            {new Date(inquiry.createdAt).toLocaleDateString('he-IL')}
                                        </time>
                                    </div>
                                </div>

                                <div className="iq-person">
                                    <strong className="iq-person__name">{inquiry.name}</strong>
                                    <span className="iq-person__pref">
                                        דרך מועדפת לחזרה: {CONTACT_LABELS[inquiry.preferredContact] || inquiry.preferredContact}
                                    </span>
                                </div>

                                {/* הודעת הלקוח */}
                                <blockquote className="iq-message">{inquiry.message}</blockquote>

                                {/* דרכי יצירת קשר – לחיצה פותחת חיוג / WhatsApp / מייל */}
                                <div className="iq-contacts">
                                    <a href={whatsappLink(inquiry.phone)} target="_blank" rel="noreferrer"
                                        className={`iq-contact ${inquiry.preferredContact === 'WhatsApp' ? 'iq-contact--pref' : ''}`}>
                                        <WhatsAppIcon className="iq-contact__icon" />
                                        WhatsApp
                                    </a>
                                    <a href={`tel:${inquiry.phone}`}
                                        className={`iq-contact ${inquiry.preferredContact === 'Phone' ? 'iq-contact--pref' : ''}`}>
                                        <PhoneIcon className="iq-contact__icon" />
                                        <bdi>{inquiry.phone}</bdi>
                                    </a>
                                    {inquiry.email ? (
                                        <a href={`mailto:${inquiry.email}`}
                                            className={`iq-contact ${inquiry.preferredContact === 'Email' ? 'iq-contact--pref' : ''}`}>
                                            <MailIcon className="iq-contact__icon" />
                                            <bdi>{inquiry.email}</bdi>
                                        </a>
                                    ) : (
                                        <span className="iq-contact iq-contact--empty">
                                            <MailIcon className="iq-contact__icon" />
                                            מייל לא צוין
                                        </span>
                                    )}
                                </div>

                                {/* שינוי סטטוס – אותם ערכים בדיוק כמו ב-select הקודם */}
                                <div className="iq-status">
                                    <span className="iq-status__label" id={`st-${inquiry._id}`}>סטטוס:</span>
                                    <div className="iq-status__options" role="group" aria-labelledby={`st-${inquiry._id}`}>
                                        {STATUSES.map((s) => (
                                            <button
                                                key={s.value}
                                                type="button"
                                                className={`iq-status__btn ${inquiry.status === s.value ? `iq-status__btn--on iq-status__btn--${s.value}` : ''}`}
                                                aria-pressed={inquiry.status === s.value}
                                                onClick={() => handleStatusChange(inquiry._id, s.value)}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </section>
    );

};

export default SupplierInquiries;