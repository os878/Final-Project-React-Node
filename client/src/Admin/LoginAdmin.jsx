import React, { useState } from 'react';
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export const LoginAdmin = () => {
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

            alert("התחברות המנהל בוצעה בהצלחה!");
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

    // הרשמת מנהל חדש
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

            setSignLogin(true);
            setErrorMessage("");

            alert("הרשמת המנהל בוצעה בהצלחה! כעת ניתן להתחבר.");
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
        <>
            <div>

                <div>
                    <button onClick={() => setSignLogin(true)} id="btnLogin">
                        התחברות מנהל
                    </button>

                    <button onClick={() => setSignLogin(false)} id="btnSighnUp">
                        הרשמת מנהל
                    </button>
                </div>

                {signLogin ? (

                    // טופס התחברות מנהל
                    <form onSubmit={submitForm}>

                        <label htmlFor="inputUsername">שם משתמש</label>
                        <input
                            onChange={(e) => handleInputChange(setUsername, e.target.value)}
                            type="text"
                            id="inputUsername"
                        />

                        <label htmlFor="inputPassword">סיסמה</label>
                        <input
                            onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                            type="password"
                            id="inputPassword"
                        />

                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                        <button type="submit" id="submitLogin">
                            אישור
                        </button>

                    </form>

                ) : (

                    // טופס הרשמת מנהל
                    <form onSubmit={submitForm1}>

                        <label htmlFor="inputName">שם מלא</label>
                        <input
                            onChange={(e) => handleInputChange(setName, e.target.value)}
                            type="text"
                            id="inputName"
                        />

                        <label htmlFor="inputUsername">שם משתמש</label>
                        <input
                            onChange={(e) => handleInputChange(setUsername, e.target.value)}
                            type="text"
                            id="inputUsername"
                        />

                        <label htmlFor="inputPhone">טלפון</label>
                        <input
                            onChange={(e) => handleInputChange(setPhone, e.target.value)}
                            type="text"
                            id="inputPhone"
                        />

                        <label htmlFor="inputEmail">אימייל</label>
                        <input
                            onChange={(e) => handleInputChange(setEmail, e.target.value)}
                            type="text"
                            id="inputEmail"
                            placeholder="Your@gmail.com"
                        />

                        <label htmlFor="inputPassword">סיסמה</label>
                        <input
                            onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                            type="password"
                            id="inputPassword"
                            placeholder="******"
                        />

                        <label htmlFor="inputRealPassword">אימות סיסמה</label>
                        <input
                            onChange={(e) => handleInputChange(setPassword2, e.target.value)}
                            type="password"
                            id="inputRealPassword"
                            placeholder="******"
                        />

                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                        <button type="submit" id="submitSighn">
                            אישור
                        </button>

                    </form>

                )}

            </div>
        </>
    );
};

export default LoginAdmin;