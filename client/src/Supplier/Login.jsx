import React, { useState } from 'react'
import Axios from "axios"
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [signLogin, setSignLogin] = useState(true) // true = התחברות, false = הרשמה
    const [name, setName] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    
    const navigate = useNavigate();

    const validateEmail = (emailToTest) => {
        return emailToTest.includes('@') && emailToTest.includes('.') && emailToTest.indexOf('@') < emailToTest.lastIndexOf('.')
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage(""); // איפוס שגיאה

        if (!name || !password1) {
            setErrorMessage("יש למלא את כל השדות");
            return;
        }

        try {
            const { data } = await Axios.post(
                "http://localhost:7002/api/auth/supplier/login",
                { name, password: password1 }
            );

            // שמירת הטוקן ב-localStorage
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
            }
            
            navigate("/Supplier/ProfilSupplier"); // מעבר לעמוד המתנות לאחר התחברות מוצלחת
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("שגיאה בהתחברות, בדוק את הפרטים שהזנת");
            }
        }
    }

    const submitForm1 = async (e) => {
        e.preventDefault()
        setErrorMessage(""); // איפוס שגיאה

        // בדיקות תקינות
        if (!name || !phone || !companyName) {
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
            const { data } = await Axios.post(
                "http://localhost:7002/api/auth/supplier/register", 
                { name, password: password1, phone, email, companyName }
            );

            alert("ההרשמה בוצעה בהצלחה!");

            // אם השרת מחזיר טוקן כבר ברישום - שומרים ומעבירים לפרופיל
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
                navigate("/Supplier/ProfilSupplier");
            } else {
                // אם השרת לא מחזיר טוקן ברישום, מעבירים למצב התחברות
                setSignLogin(true);
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("אירעה שגיאה בעת ההרשמה");
            }
        }
    }

    const handleInputChange = (setter, value) => {
        setter(value);
        if (errorMessage) setErrorMessage(""); // ניקוי הודעת השגיאה בעת הקלדה
    }

    return (
        <div>
            <div>
                <button onClick={() => { setSignLogin(true); setErrorMessage(""); }} id="btnLogin">התחברות</button>
                <button onClick={() => { setSignLogin(false); setErrorMessage(""); }} id="btnSighnUp">הרשמה</button>
            </div>

            {signLogin ? (
                <form onSubmit={submitForm}>
                    <label htmlFor="inputUserName">שם</label>
                    <input 
                        onChange={(e) => handleInputChange(setName, e.target.value)} 
                        type="text" 
                        id="inputUserName" 
                        value={name}
                    />

                    <label htmlFor="inputPassword">סיסמא</label>
                    <input 
                        onChange={(e) => handleInputChange(setPassword1, e.target.value)} 
                        type="password" 
                        id="inputPassword" 
                        value={password1}
                    />

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                    <button type="submit" id="submitLogin">אישור</button>
                </form>
            ) : (
                <form onSubmit={submitForm1}>
                    <label htmlFor="inputName">שם</label>
                    <input 
                        onChange={(e) => handleInputChange(setName, e.target.value)} 
                        type="text" 
                        id="inputName" 
                        value={name}
                    />

                    <label htmlFor="inputPhone">טלפון</label>
                    <input 
                        onChange={(e) => handleInputChange(setPhone, e.target.value)} 
                        type="text" 
                        id="inputPhone" 
                        value={phone}
                    />

                    <label htmlFor="inputCompanyName">שם חברה</label>
                    <input 
                        onChange={(e) => handleInputChange(setCompanyName, e.target.value)} 
                        type="text" 
                        id="inputCompanyName" 
                        value={companyName}
                    />

                    <label htmlFor="inputEmail">אימייל</label>
                    <input 
                        onChange={(e) => handleInputChange(setEmail, e.target.value)} 
                        type="text" 
                        id="inputEmail" 
                        placeholder="Your@gmail.com" 
                        value={email}
                    />

                    <label htmlFor="inputPasswordRegister">סיסמא</label>
                    <input 
                        onChange={(e) => handleInputChange(setPassword1, e.target.value)} 
                        type="password" 
                        id="inputPasswordRegister" 
                        placeholder="****" 
                        value={password1}
                    />

                    <label htmlFor="inputRealPassword">אימות סיסמא</label>
                    <input 
                        onChange={(e) => handleInputChange(setPassword2, e.target.value)} 
                        type="password" 
                        id="inputRealPassword" 
                        placeholder="****" 
                        value={password2}
                    />

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                    <button type="submit" id="submitSighn">אישור</button>
                </form>
            )}
        </div>
    )
}

export default Login