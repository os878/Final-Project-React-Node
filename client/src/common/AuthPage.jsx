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
            navigate("/Customer/ProfilCustomer");
            return;
        } catch (err) { }

        // 2. ספק
        try {
            const { data } = await Axios.post("http://localhost:7002/api/auth/supplier/login", {
                name: username,
                password: password1
            });
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
            }
            navigate("/Supplier/ProfilSupplier");
            return;
        } catch (err) { }

        // 3. מנהל
        try {
            const { data } = await Axios.post("http://localhost:7002/api/auth/admin/login", {
                username,
                password: password1
            });
            localStorage.setItem("token", data.accessToken);
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
        <main className="auth-page">
            <div className="auth-card">
                <section className="auth-form-panel" aria-label="טופס התחברות והרשמה">
                    <div className="auth-tabs" role="tablist" aria-label="בחירת פעולה">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={isLogin}
                            className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
                            onClick={() => { setIsLogin(true); setErrorMessage(""); }}
                        >
                            התחברות
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={!isLogin}
                            className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
                            onClick={() => { setIsLogin(false); setErrorMessage(""); }}
                        >
                            {isSupplierFlow ? 'הצטרפות כספק' : 'הרשמה'}
                        </button>
                    </div>

                    <header className="auth-form-heading">
                        <h1 className="auth-title">
                            {isLogin
                                ? 'שמחים לראות אותך שוב'
                                : (isSupplierFlow ? 'הצטרפות כספק ל-Gifter' : 'הרשמה ל-Gifter')}
                        </h1>
                        <p className="auth-intro">
                            {isLogin ? 'התחברו כדי להמשיך מאיפה שעצרתם.' : 'כמה פרטים קצרים, ואתם בפנים.'}
                        </p>
                    </header>

                    {isLogin ? (
                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="auth-field">
                                <label htmlFor="loginUser">שם משתמש</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                    </svg>
                                    <input
                                        id="loginUser"
                                        type="text"
                                        value={username}
                                        onChange={(e) => handleInputChange(setUsername, e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="loginPass">סיסמה</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
                                    </svg>
                                    <input
                                        id="loginPass"
                                        type="password"
                                        value={password1}
                                        onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                                    />
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="auth-error" role="alert">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 8v4m0 4h.01" />
                                    </svg>
                                    {errorMessage}
                                </p>
                            )}
                            <button type="submit" className="auth-submit">
                                התחבר
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
                                </svg>
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleRegister}>
                            <div className="auth-field">
                                <label htmlFor="regName">שם מלא</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                    </svg>
                                    <input
                                        id="regName"
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleInputChange(setName, e.target.value)}
                                    />
                                </div>
                            </div>

                            {registerRole === 'customer' && (
                                <div className="auth-field">
                                    <label htmlFor="regUsername">שם משתמש</label>
                                    <div className="auth-input-wrap">
                                        <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                        </svg>
                                        <input
                                            id="regUsername"
                                            type="text"
                                            value={username}
                                            onChange={(e) => handleInputChange(setUsername, e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {registerRole === 'supplier' && (
                                <div className="auth-field">
                                    <label htmlFor="regCompany">שם חברה</label>
                                    <div className="auth-input-wrap">
                                        <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M3 21h18M5 21V7l8-4v18m6 0V11l-6-4" />
                                            <path d="M8 9v.01M8 12v.01M8 15v.01M16 14v.01M16 17v.01" />
                                        </svg>
                                        <input
                                            id="regCompany"
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => handleInputChange(setCompanyName, e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="auth-field">
                                <label htmlFor="regPhone">טלפון</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
                                    </svg>
                                    <input
                                        id="regPhone"
                                        type="text"
                                        value={phone}
                                        onChange={(e) => handleInputChange(setPhone, e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="regEmail">אימייל</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>
                                    <input
                                        id="regEmail"
                                        type="text"
                                        value={email}
                                        onChange={(e) => handleInputChange(setEmail, e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="regPass1">סיסמה</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
                                    </svg>
                                    <input
                                        id="regPass1"
                                        type="password"
                                        value={password1}
                                        onChange={(e) => handleInputChange(setPassword1, e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="regPass2">אימות סיסמה</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
                                    </svg>
                                    <input
                                        id="regPass2"
                                        type="password"
                                        value={password2}
                                        onChange={(e) => handleInputChange(setPassword2, e.target.value)}
                                    />
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="auth-error" role="alert">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 8v4m0 4h.01" />
                                    </svg>
                                    {errorMessage}
                                </p>
                            )}
                            <button type="submit" className="auth-submit">
                                אישור הרשמה
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
                                </svg>
                            </button>
                        </form>
                    )}

                    <p className="auth-switch">
                        {isLogin ? 'עוד אין לך חשבון?' : 'כבר רשומים?'}
                        <button
                            type="button"
                            className="auth-switch-button"
                            onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); }}
                        >
                            {isLogin ? 'להרשמה' : 'להתחברות'}
                        </button>
                    </p>
                </section>

                <aside className="auth-content-panel">
                    <div className="auth-brand">
                        <span className="auth-wordmark">
                            <span className="sr-only">Gifter</span>
                            <span dir="ltr" aria-hidden="true">
                                G
                                <span className="auth-wordmark__i">
                                    ı
                                    <svg className="auth-wordmark__bulb" viewBox="0 0 40 46" aria-hidden="true">
                                        <circle cx="20" cy="17" r="13" fill="#D9B26A" />
                                        <rect x="14" y="33" width="12" height="4" rx="2" fill="#F3ECE0" />
                                        <rect x="16" y="39" width="8" height="4" rx="2" fill="#F3ECE0" />
                                    </svg>
                                </span>
                                fter
                            </span>
                        </span>
                        <p className="auth-slogan">
                            מוצאים בקלות, <span>מעניקים בכיף.</span>
                        </p>
                    </div>
                    <div className="auth-content-copy">
                        <h2>{isSupplierFlow ? 'הלקוחות שלכם כבר מחפשים מתנה' : 'המתנה המושלמת מתחילה כאן'}</h2>
                        <p>
                            {isSupplierFlow
                                ? 'ב-Gifter המוצר שלכם מגיע ישר למי שמחפש בדיוק אותו, ברגע שהוא מוכן לקנות.'
                                : 'עונים על כמה שאלות קצרות על מי שמקבל, ומקבלים רעיונות שמתאימים בדיוק לו.'}
                        </p>
                        <ul className="auth-perks">
                            {(isSupplierFlow
                                ? ['פוגשים קונים ברגע הנכון', 'לא נבלעים בין אלפי מוצרים', 'הצטרפות פשוטה ומהירה']
                                : ['המלצות לפי מי שמקבל', 'בלי לחפש שעות', 'רעיונות מקוריים או מוצרים מוכנים']
                            ).map((perk) => (
                                <li className="auth-perk" key={perk}>
                                    <span className="auth-perk-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="m5 12 4 4L19 6" />
                                        </svg>
                                    </span>
                                    <span>{perk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <svg className="auth-gift-decoration" viewBox="0 0 220 220" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M25 92h170v112H25zM15 62h190v38H15zM110 62v142" />
                        <path d="M110 62H67c-17 0-28-10-28-23 0-14 11-24 25-24 25 0 46 47 46 47Zm0 0h43c17 0 28-10 28-23 0-14-11-24-25-24-25 0-46 47-46 47Z" />
                    </svg>
                </aside>
            </div>
        </main>
    );
};

export default AuthPage;