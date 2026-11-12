import React, { useState } from 'react';
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFeedback } from '../common/Feedback';

const AddAdmin = () => {
    const { toast } = useFeedback();
    // תיקון: navigate היה בשימוש בלי שהוגדר, ולכן ההרשמה נכשלה אחרי ההצלחה
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const validateEmail = (emailToTest) => {
        return emailToTest.includes('@') &&
            emailToTest.includes('.') &&
            emailToTest.indexOf('@') < emailToTest.lastIndexOf('.');
    }
    const submitForm1 = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!name || !username || !email || !phone || !password1 || !password2) {
            setErrorMessage("יש למלא את כל השדות");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("כתובת האימייל אינה תקינה");
            return;
        }

        if (password1.length < 6) {
            setErrorMessage("הסיסמה חייבת להכיל לפחות 6 תווים");
            return;
        }

        if (password1 !== password2) {
            setErrorMessage("סיסמאות אינן תואמות");
            return;
        }

        try {
            await Axios.post(
                "http://localhost:7002/api/auth/admin/register",
                {
                    name,
                    username,
                    password: password1,
                    email,
                    phone
                }
            );

            setErrorMessage("")
            toast("הרשמת המנהל בוצעה בהצלחה! כעת ניתן להתחבר.", "success");
            navigate("/Admin/ProfilAdmin");

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("אירעה שגיאה בעת הרשמת המנהל");
            }
        }
    };

    // עדכון שדות ואיפוס הודעת שגיאה
    const handleInputChange = (setter, value) => {
        setter(value);

        if (errorMessage) {
            setErrorMessage("");
        }
    };
    return (
        <div className="fm" dir="rtl">
            <div className="fm-head">
                <span className="fm-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z" /><path d="M12 9v6M9 12h6" /></svg>
                </span>
                <div>
                    <h1 className="fm-title">הוספת מנהל</h1>
                    <p className="fm-sub">המנהל החדש יקבל גישה מלאה ללוח הניהול.</p>
                </div>
            </div>

            <form className="fm-form" onSubmit={submitForm1}>
                <div className="fm-grid">
                    <div className="fm-field">
                        <label htmlFor="inputName">שם מלא</label>
                        <input
                            onChange={(e) => handleInputChange(setName, e.target.value)}
                            type="text"
                            id="inputName"
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="inputUsername">שם משתמש</label>
                        <input
                            onChange={(e) => handleInputChange(setUsername, e.target.value)}
                            type="text"
                            id="inputUsername"
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="inputPhone">טלפון</label>
                        <input
                            onChange={(e) => handleInputChange(setPhone, e.target.value)}
                            type="tel"
                            id="inputPhone"
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="inputEmail">אימייל</label>
                        <input
                            onChange={(e) => handleInputChange(setEmail, e.target.value)}
                            type="email"
                            id="inputEmail" placeholder="Your@gmail.com"
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="inputPassword">סיסמה</label>
                        <input
                            onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                            type="password"
                            id="inputPassword" placeholder="******"
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="inputRealPassword">אימות סיסמה</label>
                        <input
                            onChange={(e) => handleInputChange(setPassword2, e.target.value)}
                            type="password"
                            id="inputRealPassword" placeholder="******"
                        />
                    </div>
                </div>

                {errorMessage && <p className="pg-error" role="alert">{errorMessage}</p>}

                <button type="submit" id="submitSighn" className="ag-submit">
                    הוספת מנהל
                </button>

            </form>
        </div>
    )

}
export default AddAdmin