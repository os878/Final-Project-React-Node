import React, { useState } from 'react'
import { Form } from 'react-router-dom'
import Axios from "axios"


export const Login = () => {
    const [signLogin, setSignLogin] = useState(true)//login - התחברות
    const [name, setName] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const validateEmail = (emailToTest) => {
        return emailToTest.includes('@') && emailToTest.includes('.') && emailToTest.indexOf('@') < emailToTest.lastIndexOf('.')
    }
    const submitForm = async (e) => {//צריך לשמור פה את הTOKEN
        e.preventDefault()
        setErrorMessage(""); // איפוס שגיאה אדומה
        if (!name || !password1) {
            setErrorMessage("יש למלא את כל השדות");
            return;
        }
        try {
            const { data } = await Axios.post("http://localhost:7002/api/auth/login", { name, password: password1 })
            alert("gooooooood")

            navigate("/Profil")
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
        setErrorMessage(""); // איפוס שגיאה אדומה

        // בדיקות תקינות
        if (!validateEmail(email)) {
            setErrorMessage("כתובת האימייל אינה תקינה");
            return;
        }

        if (password1.length < 6) {
            setErrorMessage("הסיסמה חייבת להכיל לפחות 6 תווים");
            return;
        }
        if (password1 != password2) {
            setErrorMessage("סיסמאות אינן תואמות")
            return
        }
        try {
            const { data } = await Axios.post("http://localhost:7002/api/auth/register", { name, password: password1, phone, email, companyName })
            setSignLogin(true);
            setErrorMessage("");
            alert("ההרשמה בוצעה בהצלחה! כעת ניתן להתחבר.");
            navigate("/Profil")

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
        if (errorMessage) setErrorMessage(""); // מעלים את הכיתוב האדום ברגע שמתחילים לתקן
    }
    return (
        <>
            <div>


                <div>
                    <button onClick={() => setSignLogin(true)} id="btnLogin">התחברות</button>
                    <button onClick={() => setSignLogin(false)} id="btnSighnUp">הרשמה</button>
                </div>
                {(signLogin) ? (
                    <form onSubmit={submitForm}>
                        <label for="inputUserName">שם</label>
                        <input onChange={(e) => handleInputChange(setName, e.target.value)} type="text" id="inputUserName" />
                        <label for="inputPassword">סיסמא</label>
                        <input onChange={(e) => handleInputChange(setPassword1, e.target.value)} type="password" id="inputPassword" />
                        <button type="submit" id="submitLogin">אישור</button>

                    </form>
                ) : (
                    <form onSubmit={submitForm1}>
                        <label for="inputName">שם</label>
                        <input onChange={(e) => handleInputChange(setName, e.target.value)} type="text" id="inputName" />
                        <label for="inputPhone">טלפון</label>
                        <input onChange={(e) => handleInputChange(setPhone, e.target.value)} type="text" id="inputPhone" />
                        <label for="inputCompanyName">שם חברה</label>
                        <input onChange={(e) => handleInputChange(setCompanyName, e.target.value)} type="text" id="inputCompanyName" />
                        <label for="inputEmail">אימייל</label>
                        <input onChange={(e) => handleInputChange(setEmail, e.target.value)} type="text" id="inputEmail" placeholder="Your@gmail.com" />
                        <label for="inputPassword">סיסמא</label>
                        <input onChange={(e) => handleInputChange(setPassword1, e.target.value)} type="password" id="inputPassword" placeholder="****" />
                        <label for="inputRealPassword">אימות סיסמא</label>
                        <input onChange={(e) => handleInputChange(setPassword2, e.target.value)} type="password" id="inputRealPassword" placeholder="****" />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}                        <button type="submit" id="submitSighn">אישור</button>

                    </form>)}
            </div>
        </>
    )
}
export default Login