import { useEffect, useState } from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import Axios from "axios"
import Header from "./Header"

const API = "http://localhost:7002"

// דף הבית של כל סוג משתמש
export const HOME_BY_ROLE = {
    customer: "/Customer/ProfilCustomer",
    supplier: "/Supplier/ProfilSupplier",
    admin: "/Admin/ProfilAdmin",
}

// איזה סוג משתמש מורשה לראות כל אזור באתר
const AREAS = [
    { prefix: "/Admin", role: "admin" },
    { prefix: "/Supplier", role: "supplier" },
    { prefix: "/AddGift", role: "supplier" },
    { prefix: "/Customer", role: "customer" },
    { prefix: "/PresentingGifts", role: "customer" },
    { prefix: "/Giftinspirations", role: "customer" },
]

const Layout = () => {
    const location = useLocation()
    // "loading" = עדיין בודקים מול השרת, null = לא מחובר
    const [role, setRole] = useState("loading")

    // סוג המשתמש מגיע מהשרת, שבודק את ה-token. לא סומכים על localStorage.
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setRole(null)
            return
        }
        Axios.get(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => setRole(data.role || null))
            .catch(() => {
                localStorage.removeItem("token")
                setRole(null)
            })
    }, [])

    if (role === "loading") {
        return <div className="layout-loading" role="status">טוען…</div>
    }

    // שמירה על הדפים: מי שלא מורשה לאזור מועבר החוצה
    const area = AREAS.find((a) => location.pathname.startsWith(a.prefix))
    if (area && role !== area.role) {
        return <Navigate to={role ? HOME_BY_ROLE[role] : "/login"} replace />
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role") // ניקוי שאריות מהגרסה הקודמת
        setRole(null)
    }

    return (
        <div className="layout-container">
            <Header role={role} onLogout={logout} />

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout