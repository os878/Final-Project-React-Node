import { useState, useEffect } from 'react';
import Axios from 'axios';

const AdminDetails = () => {

    // משתנה שקובע האם אנחנו במצב עריכה או במצב תצוגה
    const [isEditing, setIsEditing] = useState(false);

    // משתנים ששומרים את פרטי המנהל
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // שומר את אובייקט המנהל שהתקבל מהשרת
    const [admin, setAdmin] = useState(null);

    // משתנה שמאפשר להציג הודעה בזמן טעינת הפרטים
    const [isLoading, setIsLoading] = useState(true);

    // useEffect רץ לאחר שהקומפוננטה נטענת
    useEffect(() => {

        // פונקציה שמביאה את פרטי המנהל מהשרת
        const getAdmin = async () => {
            try {
                // שליפת ה-token שנשמר בדפדפן בזמן ההתחברות
                const token = localStorage.getItem('token');

                // שליחת בקשת GET לשרת עם ה-token של המנהל
                const { data } = await Axios.get(
                    'http://localhost:7002/api/admin/findByIdA',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // שמירת אובייקט המנהל שהתקבל מהשרת
                const adminData = data;
                setAdmin(adminData);

                // הכנסת פרטי המנהל למשתני ה-state
                setName(adminData.name || '');
                setUsername(adminData.username || '');
                setEmail(adminData.email || '');
                setPhone(adminData.phone || '');

            } catch (error) {
                console.error('Error fetching admin:', error.response?.data || error);
            } finally {
                // בסיום הבקשה מפסיקים להציג טעינה
                setIsLoading(false);
            }
        };

        // הפעלת הפונקציה
        getAdmin();

    }, []);

    // פונקציה שמופעלת כשלוחצים על שמירת שינויים
    const submitForm = async (e) => {

        // מונע מהדפדפן לבצע רענון של העמוד
        e.preventDefault();

        try {
            // שליפת ה-token
            const token = localStorage.getItem('token');

            // שליחת בקשת PUT לעדכון פרטי המנהל
            const { data } = await Axios.put(
                'http://localhost:7002/api/admin/',
                {
                    id: admin._id,
                    name: name,
                    username: username,
                    email: email,
                    phone: phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // עדכון פרטי המנהל אם השרת החזיר את האובייקט המעודכן
            if (data.admin) {
                setAdmin(data.admin);
            } 
            // עדכון האובייקט המקומי לפי הערכים שנשמרו
            else {
                setAdmin({
                    ...admin,
                    name: name,
                    username: username,
                    email: email,
                    phone: phone
                });
            }

            // יציאה ממצב עריכה לאחר הצלחה
            setIsEditing(false);

        } catch (error) {
            console.error('Error updating admin:', error.response?.data || error);
        }
    };

    // אם הפרטים עדיין נטענים, מציגים הודעה
    if (isLoading) {
        return <p className="gd-state" role="status">טוען פרטי מנהל…</p>;
    }

    // אם הטעינה הסתיימה אבל לא התקבלו פרטי מנהל
    if (!admin) {
        return <p className="gd-state gd-state--error" role="alert">לא ניתן לטעון את פרטי המנהל.</p>;
    }

    return (
        <section className="pd" dir="rtl">
            {/* כותרת וכפתורים לעריכה או לשמירה */}
            <div className="header-section">
                <span className="pd-avatar" aria-hidden="true">{(admin.name || '?').trim().charAt(0)}</span>
                <div className="pd-title">
                    <h2>פרטי מנהל</h2>
                    <p>{isEditing ? 'עורכים את הפרטים. אל תשכחו לשמור.' : 'פרטי החשבון שלך'}</p>
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

                        {/* ביטול העריכה והחזרת הערכים המקוריים */}
                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setName(admin.name || '');
                                setUsername(admin.username || '');
                                setEmail(admin.email || '');
                                setPhone(admin.phone || '');
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

            <div className="pd-fields">

            {/* שדה שם המנהל */}
            <div className="field-group">
                <label htmlFor="adName">שם המנהל:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
                            id="adName"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        <span>{name}</span>
                    )}
                </div>
            </div>

            {/* שדה שם המשתמש */}
            <div className="field-group">
                <label htmlFor="adUsername">שם משתמש:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
                            id="adUsername"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    ) : (
                        <span>{username}</span>
                    )}
                </div>
            </div>

            {/* שדה כתובת הדואר האלקטרוני */}
            <div className="field-group">
                <label htmlFor="adEmail">דואר אלקטרוני:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="email"
                            id="adEmail"
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
                <label htmlFor="adPhone">טלפון:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="tel"
                            id="adPhone"
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

export default AdminDetails;