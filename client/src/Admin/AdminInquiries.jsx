import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useFeedback } from '../common/Feedback';
import { API_URL } from '../config'; // כתובת השרת – מוגדרת במקום אחד

// ===== דף מנהל: כל הפניות באתר ומה המצב שלהן =====

// אותם ערכים כמו בשרת (New / InProgress / Handled), התצוגה בעברית.
// זהה למה שהספק רואה ב-SupplierInquiries, כדי ששני הדפים ידברו באותה שפה.
const STATUSES = [
    { value: 'New', label: 'חדשה', short: 'חדשות' },
    { value: 'InProgress', label: 'בטיפול', short: 'בטיפול' },
    { value: 'Handled', label: 'טופלה', short: 'טופלו' },
];
const statusLabel = (value) => STATUSES.find((s) => s.value === value)?.label || value;

const CONTACT_LABELS = { WhatsApp: 'WhatsApp', Phone: 'טלפון', Email: 'מייל' };

const API = `${API_URL}/api/inquiry`;

// כמה ימים עברו מתאריך מסוים עד היום
const daysSince = (date) => Math.floor((Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000));

// שם הספק לתצוגה: שם החברה אם יש, אחרת השם. אם הספק נמחק – הודעה במקום קריסה
const supplierName = (supplier) => supplier ? (supplier.companyName || supplier.name) : 'ספק שנמחק';

const AdminInquiries = () => {
    const { toast, confirm } = useFeedback();

    const [inquiries, setInquiries] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // סינונים – כולם רק בתצוגה, לא משנים כלום בשרת
    const [statusFilter, setStatusFilter] = useState('All');   // All / New / InProgress / Handled / Stuck
    const [supplierFilter, setSupplierFilter] = useState('All');
    const [search, setSearch] = useState('');

    // איזו שורה פתוחה כרגע לצפייה בפרטים (רק אחת בכל פעם)
    const [openId, setOpenId] = useState(null);

    // טוען גם את הפניות וגם את הסיכום.
    // פונקציה נפרדת כי קוראים לה פעמיים: בטעינת הדף, ואחרי מחיקה.
    const loadData = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            // Promise.all שולח את שתי הבקשות במקביל ומחכה לשתיהן – מהיר יותר מאחת אחרי השנייה
            const [listRes, statsRes] = await Promise.all([
                Axios.get(`${API}/admin`, config),
                Axios.get(`${API}/admin/stats`, config),
            ]);
            setInquiries(listRes.data);
            setStats(statsRes.data);
            setError('');
        } catch (err) {
            console.error('שגיאה בטעינת הפניות:', err);
            setError(err.response?.data?.message || 'לא ניתן לטעון את הפניות');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // "תקועה" = עדיין חדשה, ועברו יותר ימים ממה שהשרת הגדיר (stuckDays)
    const isStuck = (inquiry) =>
        inquiry.status === 'New' && stats && daysSince(inquiry.createdAt) >= stats.stuckDays;

    const handleDelete = async (inquiry) => {
        const ok = await confirm({
            title: 'למחוק את הפנייה?',
            message: `הפנייה של ${inquiry.name} תימחק לצמיתות, גם אצל הספק.`,
            confirmText: 'מחיקה',
            cancelText: 'ביטול',
            danger: true,
        });
        if (!ok) return;

        const token = localStorage.getItem('token');
        try {
            await Axios.delete(`${API}/admin/${inquiry._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast('הפנייה נמחקה', 'success');
            setOpenId(null);
            loadData(); // טוענים מחדש כדי שגם המספרים בכרטיסים יתעדכנו
        } catch (err) {
            toast(err.response?.data?.message || 'לא ניתן למחוק את הפנייה', 'error');
        }
    };

    if (loading) return <p className="gd-state" role="status">טוען פניות…</p>;
    if (error) return <p className="gd-state gd-state--error" role="alert">{error}</p>;

    // ----- רשימת ספקים לבחירה, בלי כפילויות, מתוך הפניות עצמן -----
    const suppliers = [];
    inquiries.forEach((inq) => {
        if (inq.supplier && !suppliers.some((s) => s._id === inq.supplier._id)) {
            suppliers.push(inq.supplier);
        }
    });

    // ----- ספקים שיש להם פניות תקועות, ממוינים מהכי הרבה -----
    const stuckBySupplier = {};
    inquiries.filter(isStuck).forEach((inq) => {
        const name = supplierName(inq.supplier);
        stuckBySupplier[name] = (stuckBySupplier[name] || 0) + 1;
    });
    const stuckSuppliers = Object.entries(stuckBySupplier).sort((a, b) => b[1] - a[1]);

    // ----- הפעלת כל הסינונים, אחד אחרי השני -----
    const term = search.trim();
    const shown = inquiries
        .filter((inq) => {
            if (statusFilter === 'All') return true;
            if (statusFilter === 'Stuck') return isStuck(inq);
            return inq.status === statusFilter;
        })
        .filter((inq) => supplierFilter === 'All' || inq.supplier?._id === supplierFilter)
        .filter((inq) =>
            !term ||
            inq.name?.includes(term) ||
            inq.gift?.name?.includes(term) ||
            supplierName(inq.supplier).includes(term)
        );

    const statCards = [
        { key: 'All', label: 'כל הפניות', value: stats.total },
        { key: 'New', label: 'חדשות', value: stats.New },
        { key: 'InProgress', label: 'בטיפול', value: stats.InProgress },
        { key: 'Handled', label: 'טופלו', value: stats.Handled },
        { key: 'Stuck', label: `ממתינות מעל ${stats.stuckDays} ימים`, value: stats.stuck },
    ];

    return (
        <section className="aq" dir="rtl">
            <header>
                <p className="pg-eyebrow">לוח ניהול</p>
                <h1 className="pg-title">פניות לקוחות</h1>
                <p className="pg-sub">כל הפניות שלקוחות שלחו לספקים, ומה המצב של כל אחת.</p>
            </header>

            {/* כרטיסי סיכום. לחיצה על כרטיס = סינון לפיו */}
            <div className="aq-stats">
                {statCards.map((card) => (
                    <button
                        key={card.key}
                        type="button"
                        className={`aq-stat aq-stat--${card.key} ${statusFilter === card.key ? 'aq-stat--on' : ''}`}
                        aria-pressed={statusFilter === card.key}
                        onClick={() => setStatusFilter(card.key)}
                    >
                        <strong className="aq-stat__num">{card.value}</strong>
                        <span className="aq-stat__label">{card.label}</span>
                    </button>
                ))}
            </div>

            {/* התראה: אילו ספקים לא עונים */}
            {stuckSuppliers.length > 0 && (
                <div className="aq-alert" role="note">
                    <strong>ספקים שכדאי לבדוק</strong>
                    <span>יש להם פניות חדשות שמחכות יותר מ-{stats.stuckDays} ימים:</span>
                    <ul className="aq-alert__list">
                        {stuckSuppliers.map(([name, count]) => (
                            <li key={name}>{name} <b>({count})</b></li>
                        ))}
                    </ul>
                </div>
            )}

            {inquiries.length === 0 ? (
                <div className="pg-empty">
                    <h2>עדיין לא נשלחו פניות</h2>
                    <p>כשלקוח ישלח פנייה לספק, היא תופיע כאן.</p>
                </div>
            ) : (
                <>
                    {/* סינון לפי ספק וחיפוש חופשי */}
                    <div className="aq-filters">
                        <label className="aq-field">
                            <span>ספק</span>
                            <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
                                <option value="All">כל הספקים</option>
                                {suppliers.map((s) => (
                                    <option key={s._id} value={s._id}>{supplierName(s)}</option>
                                ))}
                            </select>
                        </label>
                        <label className="aq-field aq-field--grow">
                            <span>חיפוש</span>
                            <input
                                type="search"
                                placeholder="שם לקוח, מתנה או ספק"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                    </div>

                    <p className="aq-count" role="status">מוצגות {shown.length} מתוך {inquiries.length} פניות</p>

                    {shown.length === 0 ? (
                        <p className="iq-none">אין פניות שמתאימות לסינון.</p>
                    ) : (
                        <div className="aq-table-wrap">
                            <table className="aq-table">
                                <thead>
                                    <tr>
                                        <th scope="col">תאריך</th>
                                        <th scope="col">לקוח</th>
                                        <th scope="col">מתנה</th>
                                        <th scope="col">ספק</th>
                                        <th scope="col">סטטוס</th>
                                        <th scope="col"><span className="sr-only">פעולות</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shown.map((inq) => {
                                        const stuck = isStuck(inq);
                                        const isOpen = openId === inq._id;
                                        return (
                                            // Fragment עם key: כל פנייה היא שתי שורות בטבלה (השורה + הפרטים)
                                            <React.Fragment key={inq._id}>
                                                <tr className={stuck ? 'aq-row aq-row--stuck' : 'aq-row'}>
                                                    <td data-label="תאריך">
                                                        <time dateTime={inq.createdAt}>
                                                            {new Date(inq.createdAt).toLocaleDateString('he-IL')}
                                                        </time>
                                                        <span className="aq-days">לפני {daysSince(inq.createdAt)} ימים</span>
                                                    </td>
                                                    <td data-label="לקוח">{inq.name}</td>
                                                    <td data-label="מתנה">{inq.gift?.name || 'מתנה שנמחקה'}</td>
                                                    <td data-label="ספק">{supplierName(inq.supplier)}</td>
                                                    <td data-label="סטטוס">
                                                        <span className={`iq-badge iq-badge--${inq.status}`}>{statusLabel(inq.status)}</span>
                                                        {stuck && <span className="aq-stuck">ממתינה</span>}
                                                    </td>
                                                    <td className="aq-actions">
                                                        <button
                                                            type="button"
                                                            className="aq-btn"
                                                            aria-expanded={isOpen}
                                                            onClick={() => setOpenId(isOpen ? null : inq._id)}
                                                        >
                                                            {isOpen ? 'סגירה' : 'פרטים'}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {isOpen && (
                                                    <tr className="aq-details">
                                                        <td colSpan={6}>
                                                            <blockquote className="iq-message">{inq.message}</blockquote>
                                                            <dl className="aq-info">
                                                                <div><dt>טלפון</dt><dd><bdi>{inq.phone}</bdi></dd></div>
                                                                <div><dt>מייל</dt><dd><bdi>{inq.email || 'לא צוין'}</bdi></dd></div>
                                                                <div><dt>דרך מועדפת לחזרה</dt><dd>{CONTACT_LABELS[inq.preferredContact] || inq.preferredContact}</dd></div>
                                                            </dl>
                                                            <button type="button" className="aq-btn aq-btn--danger" onClick={() => handleDelete(inq)}>
                                                                מחיקת הפנייה
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default AdminInquiries;