import React, { useState } from 'react';
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFeedback } from '../common/Feedback';

export const LoginAdmin = () => {
    const { toast } = useFeedback();
    const [signLogin, setSignLogin] = useState(true);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // בדיקת תקינות אימייל
    const validateEmail = (emailToTest) => {
        return emailToTest.includes('@') &&
            emailToTest.includes('.') &&
            emailToTest.indexOf('@') < emailToTest.lastIndexOf('.');
    };

    // התחברות מנהל
    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!username || !password1) {
            setErrorMessage("יש למלא את כל השדות");
            return;
        }

        try {
            const { data } = await Axios.post(
                "http://localhost:7002/api/auth/admin/login",
                { username, password: password1 }
            );

            // שמירת הטוקן ב-localStorage
            localStorage.setItem("token", data.accessToken);

            toast("התחברות המנהל בוצעה בהצלחה!", "success");
            // ניווט לעמוד הפרופיל/פרטי המנהל
            navigate("/Admin/ProfilAdmin");

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("שגיאה בהתחברות, בדוק את הפרטים שהזנת");
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
    <main className="fm-page" dir="rtl">
        <div className="fm fm--narrow">
            <div className="fm-head fm-head--center">
                <span className="fm-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z" /><rect x="9" y="10.5" width="6" height="5" rx="1" /><path d="M10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5" /></svg>
                </span>
                <div>
                    <h1 className="fm-title">כניסת מנהל</h1>
                    <p className="fm-sub">אזור הניהול של Gifter</p>
                </div>
            </div>

            <form className="fm-form" onSubmit={submitForm}>
                <div className="fm-field">
                    <label htmlFor="inputUsername">שם משתמש</label>
                    <input
                        onChange={(e) => handleInputChange(setUsername, e.target.value)}
                        type="text"
                        id="inputUsername"
                        autoComplete="username"
                    />
                </div>

                <div className="fm-field">
                    <label htmlFor="inputPassword">סיסמה</label>
                    <input
                        onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                        type="password"
                        id="inputPassword"
                        autoComplete="current-password"
                    />
                </div>

                {errorMessage && <p className="pg-error" role="alert">{errorMessage}</p>}

                <button type="submit" id="submitLogin" className="ag-submit">
                    כניסה
                </button>
            </form>
        </div>
    </main>
);
};

export default LoginAdmin;