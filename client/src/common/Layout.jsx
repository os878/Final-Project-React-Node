import { useEffect, useRef, useState } from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import Axios from "axios"
import Header from "./Header"
import { useUser } from "../context/UserContext"

const API = "http://localhost:7002"

// דף הבית של כל סוג משתמש
export const HOME_BY_ROLE = {
    customer: "/Customer/ProfilCustomer",
    supplier: "/Supplier/ProfilSupplier",
    admin: "/Admin/ProfilAdmin",
}

// איזה סוג משתמש מורשה לראות כל אזור באתר.
// דפים שלא מופיעים כאן פתוחים לכולם, גם לאורח: /gifts, /gift/:id, /questionnaire, /results
const AREAS = [
    { prefix: "/Admin", role: "admin" },
    { prefix: "/Supplier", role: "supplier" },
    { prefix: "/AddGift", role: "supplier" },
    { prefix: "/Customer", role: "customer" },
    { prefix: "/Giftinspirations", role: "customer" },
]

const Layout = () => {
    const location = useLocation()
     const { setUser } = useUser();
    // "loading" = עדיין בודקים מול השרת, null = לא מחובר
    const [role, setRole] = useState("loading")

    // סוג המשתמש מגיע מהשרת, שבודק את ה-token. לא סומכים על localStorage.
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setRole(null)
            setUser(null); // ניקוי המשתמש מהקונטקסט
            return
        }
        Axios.get(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async({ data }) => {
                setRole(data.role || null);
                if (data.role === "customer") {
                try {
                    const customerRes = await Axios.get(
                        'http://localhost:7002/api/customer/findByIdC',
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("פרטי הלקוח המלאים:", customerRes.data); // <-- להוסיף את זה
                    setUser(customerRes.data);
                } catch (err) {
                    console.error("שגיאה בטעינת פרטי הלקוח:", err);
                }
            } 
            })
            .catch(() => {
                localStorage.removeItem("token")
                setRole(null)
                setUser(null); // ניקוי המשתמש מהקונטקסט
            })
           
    }, [])

    // יציאה מהחשבון: ה-role מתאפס מיד, אבל המעבר לדף הבית קורה רגע אחרי (React Router 7
    // מריץ ניווט כ"עדכון לא דחוף"). בלי הדגל הזה, השמירה למטה הייתה רואה אורח בדף מוגן
    // ושולחת אותו לדף ההתחברות במקום לדף הנחיתה.
    const justLoggedOut = useRef(false)
    useEffect(() => {
        if (location.pathname === "/") justLoggedOut.current = false
    }, [location.pathname])

    if (role === "loading") {
        return <div className="layout-loading" role="status">טוען…</div>
    }

    // שמירה על הדפים: מי שלא מורשה לאזור מועבר החוצה
    const area = AREAS.find((a) => location.pathname.startsWith(a.prefix))
    if (area && role !== area.role) {
        // אורח: לדף ההתחברות, ושומרים לאן רצה להגיע – כדי להחזיר אותו לשם אחרי הכניסה
        if (!role) {
            if (justLoggedOut.current) {
                return <Navigate to="/" replace />
            }
            return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
        }
        return <Navigate to={HOME_BY_ROLE[role]} replace />
    }

    const logout = () => {
        justLoggedOut.current = true
        localStorage.removeItem("token")
        localStorage.removeItem("role") // ניקוי שאריות מהגרסה הקודמת
        setRole(null)
        setUser(null); // ניקוי המשתמש מהקונטקסט
    }

    return (
        <div className="layout-container">
            <Header role={role} onLogout={logout} />

            <main className="main-content">
                {/* הדפים יכולים לדעת מי מחובר דרך useOutletContext() – למשל useLoginGate */}
                <Outlet context={{ role }} />
            </main>
        </div>
    )
}

export default Layout