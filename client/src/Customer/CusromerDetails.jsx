
import { useState, useEffect } from 'react';
import Axios from 'axios';

const CustomerDetails = () => {

    // משתנה שקובע האם אנחנו במצב עריכה או במצב תצוגה
    const [isEditing, setIsEditing] = useState(false);

    // משתנים ששומרים את פרטי הלקוח
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // שומר את אובייקט הלקוח שהתקבל מהשרת
    const [customer, setCustomer] = useState(null);

    // משתנה שמאפשר להציג הודעה בזמן טעינת הפרטים
    const [isLoading, setIsLoading] = useState(true);

    // useEffect רץ לאחר שהקומפוננטה נטענת
    useEffect(() => {

        // פונקציה שמביאה את פרטי הלקוח מהשרת
        const getCustomer = async () => {
            try {
                // שליפת ה-token שנשמר בדפדפן בזמן ההתחברות
                const token = localStorage.getItem('token');

                // שליחת בקשת GET לשרת עם ה-token
                const { data } = await Axios.get(
                    'http://localhost:7002/api/customer/findByIdC',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // שמירת אובייקט הלקוח שהתקבל מהשרת
                const customerData = data;
                setCustomer(customerData);

                // הכנסת פרטי הלקוח למשתני ה-state
                setName(customerData.name || '');
                setUsername(customerData.username || '');
                setEmail(customerData.email || '');
                setPhone(customerData.phone || '');

            } catch (error) {
                console.error('Error fetching customer:', error.response?.data || error);
            } finally {
                // בסיום הבקשה מפסיקים להציג טעינה
                setIsLoading(false);
            }
        };

        // הפעלת הפונקציה
        getCustomer();

    }, []);

    // פונקציה שמופעלת כשלוחצים על שמירת שינויים
    const submitForm = async (e) => {

        // מונע מהדפדפן לבצע רענון של העמוד
        e.preventDefault();

        try {
            // שליפת ה-token
            const token = localStorage.getItem('token');

            // שליחת בקשת PUT לעדכון פרטי הלקוח
            const { data } = await Axios.put(
                'http://localhost:7002/api/customer/',
                {
                    id: customer._id,
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

            // עדכון פרטי הלקוח אם השרת החזיר את הלקוח המעודכן
            if (data.customer) {
                setCustomer(data.customer);
            }

            // עדכון האובייקט המקומי לפי הערכים שנשמרו
            else {
                setCustomer({
                    ...customer,
                    name: name,
                    username: username,
                    email: email,
                    phone: phone
                });
            }

            // יציאה ממצב עריכה לאחר הצלחה
            setIsEditing(false);

        } catch (error) {
            console.error('Error updating customer:', error.response?.data || error);
        }
    };

    // אם הפרטים עדיין נטענים, מציגים הודעה
    if (isLoading) {
        return <p>טוען פרטי לקוח...</p>;
    }

    // אם הטעינה הסתיימה אבל לא התקבל לקוח
    if (!customer) {
        return <p>לא ניתן לטעון את פרטי הלקוח.</p>;
    }

    return (
        <>
            {/* כותרת וכפתורים לעריכה או לשמירה */}
            <div className="header-section">
                <h2>פרטי לקוח</h2>

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
                                setName(customer.name || '');
                                setUsername(customer.username || '');
                                setEmail(customer.email || '');
                                setPhone(customer.phone || '');
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

            {/* שדה שם הלקוח */}
            <div className="field-group">
                <label>שם הלקוח:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
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
                <label>שם משתמש:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
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
                <label>דואר אלקטרוני:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="email"
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
                <label>טלפון:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    ) : (
                        <span>{phone}</span>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomerDetails;
