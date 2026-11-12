import { useState, useEffect } from 'react';
import Axios from 'axios';

const SupplierDetails = () => {

    // משתנה שקובע האם אנחנו במצב עריכה או במצב תצוגה
    const [isEditing, setIsEditing] = useState(false);

    // משתנים ששומרים את פרטי הספק שיוצגו בשדות הטופס
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');

    // שומר את אובייקט הספק שהתקבל מהשרת
    const [supp, setSupp] = useState(null);

    // משתנה שמאפשר להציג הודעה בזמן טעינת הפרטים
    const [isLoading, setIsLoading] = useState(true);

    // useEffect רץ לאחר שהקומפוננטה נטענת
    // המערך הריק [] אומר שהאפקט ירוץ פעם אחת בעת הטעינה
    useEffect(() => {

        // פונקציה אסינכרונית שמביאה את פרטי הספק מהשרת
        const getSupplier = async () => {
            try {
                // שליפת ה-token שנשמר בדפדפן בזמן ההתחברות
                const token = localStorage.getItem('token');

                // שליחת בקשת GET לשרת עם ה-token בכותרת הבקשה
                const { data } = await Axios.get(
                    'http://localhost:7002/api/supplier/findByIdS',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // שמירת אובייקט הספק שהתקבל מהשרת
                const supplier = data;
                setSupp(supplier);

                // הכנסת פרטי הספק למשתני ה-state של השדות
                setName(supplier.name || '');
                setEmail(supplier.email || '');
                setPhone(supplier.phone || '');
                setCompanyName(supplier.companyName || '');

            } catch (error) {
                // אם הבקשה נכשלה, נדפיס את השגיאה למסוף
                console.error('Error fetching supplier:', error);
            } finally {
                // בסיום הבקשה, גם אם נכשלה, מפסיקים להציג טעינה
                setIsLoading(false);
            }
        };

        // הפעלת הפונקציה
        getSupplier();

    }, []);

    // פונקציה שמופעלת כשלוחצים על "שמירת שינויים"
    const submitForm = async (e) => {

        // מונע מהטופס לבצע את פעולת ברירת המחדל של הדפדפן
        e.preventDefault();

        try {
            // שליחת בקשת PUT לשרת לעדכון פרטי הספק
            const token = localStorage.getItem('token');

            const { data } = await Axios.put(
                'http://localhost:7002/api/supplier/',
                {
                    id: supp._id,
                    name: name,
                    email: email,
                    phone: phone,
                    companyName: companyName
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // עדכון פרטי הספק השמורים בקומפוננטה,
            // אם השרת מחזיר את הספק המעודכן
            if (data.supplier) {
                setSupp(data.supplier);
            }

            // חדש: אם השרת לא החזיר את הספק, מעדכנים לפי הערכים שנשמרו
            // (כמו בפרטי הלקוח – אחרת "ביטול" בעריכה הבאה יחזיר ערכים ישנים)
            else {
                setSupp({
                    ...supp,
                    name: name,
                    email: email,
                    phone: phone,
                    companyName: companyName
                });
            }

            // יציאה ממצב העריכה לאחר הצלחה
            setIsEditing(false);

        } catch (error) {
            console.error("Error updating supplier:", error.response?.data);
        }
    };

    // אם הפרטים עדיין נטענים, מציגים הודעה
    if (isLoading) {
        return <p className="gd-state" role="status">טוען פרטי ספק…</p>;
    }

    // אם הטעינה הסתיימה אבל לא התקבל ספק
    if (!supp) {
        return <p className="gd-state gd-state--error" role="alert">לא ניתן לטעון את פרטי הספק.</p>;
    }

    return (
        <section className="pd" dir="rtl">
            {/* כותרת וכפתורים לעריכה או לשמירה */}
            <div className="header-section">
                {/* חדש: עיגול עם האות הראשונה של שם החברה */}
                <span className="pd-avatar" aria-hidden="true">{(supp.companyName || supp.name || '?').trim().charAt(0)}</span>
                <div className="pd-title">
                    <h2>פרטי ספק</h2>
                    <p>{isEditing ? 'עורכים את הפרטים. אל תשכחו לשמור.' : 'כך הלקוחות רואים את העסק שלכם'}</p>
                </div>

                {isEditing ? (
                    <div className="button-group">
                        {/* לחיצה מפעילה את פונקציית השמירה */}
                        <button
                            className="save-btn"
                            onClick={submitForm}
                        >
                            שמירת שינויים
                        </button>

                        {/* ביטול העריכה וחזרה למצב תצוגה */}
                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setName(supp.name || '');
                                setEmail(supp.email || '');
                                setPhone(supp.phone || '');
                                setCompanyName(supp.companyName || '');
                                setIsEditing(false);
                            }}
                        >
                            ביטול
                        </button>
                    </div>
                ) : (
                    // מעבר ממצב תצוגה למצב עריכה
                    <button
                        className="edit-btn"
                        onClick={() => setIsEditing(true)}
                    >
                        עריכת פרטים
                    </button>
                )}
            </div>

            {/* חדש: עוטף את השדות כדי לסדר אותם ברשת */}
            <div className="pd-fields">

            {/* שדה שם הספק */}
            <div className="field-group">
                <label htmlFor="sdName">שם הספק:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
                            id="sdName"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        <span>{name}</span>
                    )}
                </div>
            </div>

            {/* שדה שם החברה */}
            <div className="field-group">
                <label htmlFor="sdCompany">שם החברה:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
                            id="sdCompany"
                            name="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    ) : (
                        <span>{companyName}</span>
                    )}
                </div>
            </div>

            {/* שדה כתובת הדואר האלקטרוני */}
            <div className="field-group">
                <label htmlFor="sdEmail">דואר אלקטרוני:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="email"
                            id="sdEmail"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    ) : (
                        <span>{email}</span>
                    )}
                </div>
            </div>

            {/* שדה מספר הטלפון */}
            <div className="field-group">
                <label htmlFor="sdPhone">טלפון:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="tel"
                            id="sdPhone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    ) : (
                        <span>{phone}</span>
                    )}
                </div>
            </div>

            </div>
        </section>
    );
};

export default SupplierDetails;