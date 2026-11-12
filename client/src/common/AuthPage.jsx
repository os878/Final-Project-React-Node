import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthPage = () => {
    const [searchParams] = useSearchParams();
    
    // הגעה מהחלק של הספקים בדף הנחיתה (?role=supplier) = הרשמה כספק בלבד.
    // מכל מקום אחר = הרשמה כלקוח בלבד.
    const isSupplierFlow = searchParams.get('role') === 'supplier';
    const registerRole = isSupplierFlow ? 'supplier' : 'customer';

    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (searchParams.get('mode') === 'register') {
            setIsLogin(false);
        }
    }, [searchParams]);

    const validateEmail = (emailToTest) => {
        return emailToTest.includes('@') &&
            emailToTest.includes('.') &&
            emailToTest.indexOf('@') < emailToTest.lastIndexOf('.');
    };

    const handleInputChange = (setter, value) => {
        setter(value);
        if (errorMessage) setErrorMessage("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!username || !password1) {
            setErrorMessage("יש למלא את כל השדות");
            return;
        }

        // 1. לקוח
        try {
            const { data } = await Axios.post("http://localhost:7002/api/auth/customer/login", {
                username,
                password: password1
            });
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("role", "customer");
            navigate("/Customer/ProfilCustomer");
            return;
        } catch (err) {}

        // 2. ספק
        try {
            const { data } = await Axios.post("http://localhost:7002/api/auth/supplier/login", {
                name: username,
                password: password1
            });
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
                localStorage.setItem("role", "supplier");
            }
            navigate("/Supplier/ProfilSupplier");
            return;
        } catch (err) {}

        // 3. מנהל
        try {
            const { data } = await Axios.post("http://localhost:7002/api/auth/admin/login", {
                username,
                password: password1
            });
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("role", "admin");
            navigate("/Admin/ProfilAdmin");
            return;
        } catch (err) {
            setErrorMessage("שם משתמש או סיסמה שגויים");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!name || !email || !phone || !password1 || !password2) {
            setErrorMessage("יש למלא את כל השדות");
            return;
        }
        if (registerRole === 'customer' && !username) {
            setErrorMessage("יש למלא שם משתמש");
            return;
        }
        if (registerRole === 'supplier' && !companyName) {
            setErrorMessage("יש למלא שם חברה");
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
            setErrorMessage("הסיסמאות אינן תואמות");
            return;
        }

        try {
            if (registerRole === 'customer') {
                await Axios.post("http://localhost:7002/api/auth/customer/register", {
                    name, username, password: password1, email, phone
                });
                alert("ההרשמה בוצעה בהצלחה! כעת ניתן להתחבר.");
                setIsLogin(true);
            } else {
                const { data } = await Axios.post("http://localhost:7002/api/auth/supplier/register", {
                    name, password: password1, phone, email, companyName
                });
                alert("הרשמת הספק בוצעה בהצלחה!");
                if (data.accessToken) {
                    localStorage.setItem("token", data.accessToken);
                    localStorage.setItem("role", "supplier");
                    navigate("/Supplier/ProfilSupplier");
                } else {
                    setIsLogin(true);
                }
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("אירעה שגיאה בעת ההרשמה");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* לשוניות עליונות: התחברות / הרשמה */}
                <div className="auth-tabs">
                    <button 
                        type="button"
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setErrorMessage(""); }}
                    >
                        התחברות
                    </button>
                    <button 
                        type="button"
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setErrorMessage(""); }}
                    >
                        {isSupplierFlow ? 'הצטרפות כספק' : 'הרשמה'}
                    </button>
                </div>

                {isLogin ? (
                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="loginUser">שם משתמש (או שם ספק)</label>
                            <input
                                id="loginUser"
                                type="text"
                                value={username}
                                onChange={(e) => handleInputChange(setUsername, e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="loginPass">סיסמה</label>
                            <input
                                id="loginPass"
                                type="password"
                                value={password1}
                                onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                            />
                        </div>

                        {errorMessage && <p className="auth-error">{errorMessage}</p>}
                        <button type="submit" className="auth-submit-btn">התחבר</button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleRegister}>
                        <h2 className="auth-title">
                            {isSupplierFlow ? 'הצטרפות כספק ל-Gifter' : 'הרשמה ל-Gifter'}
                        </h2>

                        <div className="form-group">
                            <label htmlFor="regName">שם מלא</label>
                            <input
                                id="regName"
                                type="text"
                                value={name}
                                onChange={(e) => handleInputChange(setName, e.target.value)}
                            />
                        </div>

                        {registerRole === 'customer' && (
                            <div className="form-group">
                                <label htmlFor="regUsername">שם משתמש</label>
                                <input
                                    id="regUsername"
                                    type="text"
                                    value={username}
                                    onChange={(e) => handleInputChange(setUsername, e.target.value)}
                                />
                            </div>
                        )}

                        {registerRole === 'supplier' && (
                            <div className="form-group">
                                <label htmlFor="regCompany">שם חברה</label>
                                <input
                                    id="regCompany"
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => handleInputChange(setCompanyName, e.target.value)}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="regPhone">טלפון</label>
                            <input
                                id="regPhone"
                                type="text"
                                value={phone}
                                onChange={(e) => handleInputChange(setPhone, e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="regEmail">אימייל</label>
                            <input
                                id="regEmail"
                                type="text"
                                placeholder="Your@gmail.com"
                                value={email}
                                onChange={(e) => handleInputChange(setEmail, e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="regPass1">סיסמה</label>
                            <input
                                id="regPass1"
                                type="password"
                                placeholder="******"
                                value={password1}
                                onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="regPass2">אימות סיסמה</label>
                            <input
                                id="regPass2"
                                type="password"
                                placeholder="******"
                                value={password2}
                                onChange={(e) => handleInputChange(setPassword2, e.target.value)}
                            />
                        </div>

                        {errorMessage && <p className="auth-error">{errorMessage}</p>}
                        <button type="submit" className="auth-submit-btn">אישור הרשמה</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;