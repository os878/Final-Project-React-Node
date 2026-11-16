import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { GifterLogo } from "../LandingPage" // הלוגו מדף הנחיתה

// הקישורים של כל סוג משתמש – מוגדרים רק כאן, במקום אחד
const NAV_LINKS = {
    // אורח (לא מחובר) – רואה את המתנות ואת השאלון, בלי שום דרישה להירשם
    guest: [
        { to: "/gifts", label: "כל המתנות" },
        { to: "/questionnaire", label: "מצאו לי מתנה" },
    ],
    customer: [
        { to: "/Customer/ProfilCustomer", label: "האזור שלי" },
        { to: "/questionnaire", label: "שאלון מתנות" },
        { to: "/gifts", label: "כל המתנות" },
        { to: "/Customer/Favorites", label: "מועדפים" },
        { to: "/Customer/CusromerDetails", label: "הפרטים שלי" },
    ],
    supplier: [
        { to: "/Supplier/ProfilSupplier", label: "ראשי" },
        { to: "/Supplier/GiftsList", label: "המוצרים שלי" },
        { to: "/AddGift", label: "הוספת מוצר" },
        { to: "/Supplier/Inquiries", label: "פניות לקוחות" },
        { to: "/Supplier/SupplierDetails", label: "פרטי הספק" },
    ],
    admin: [
        { to: "/Admin/ProfilAdmin", label: "לוח ניהול" },
        { to: "/Admin/AllCustomers", label: "לקוחות" },
        { to: "/Admin/AllSuppliers", label: "ספקים" },
        { to: "/Admin/AllGifts", label: "מוצרים" },
        { to: "/Admin/Inquiries", label: "פניות" }, // חדש
        { to: "/Admin/AddAdmin", label: "הוספת מנהל" },
        { to: "/Admin/MaintenanceManager", label: "תחזוקה" },
    ],
}

const ROLE_NAMES = { customer: "לקוח", supplier: "ספק", admin: "מנהל" }

// role מגיע מה-Layout, אחרי שהשרת אישר אותו
const Header = ({ role, onLogout }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const links = NAV_LINKS[role || "guest"] || []

    const logout = () => {
        onLogout()
        navigate("/")
    }

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <NavLink to="/" className="site-header__logo" aria-label="Gifter – לדף הבית">
                    <GifterLogo size={36} />
                </NavLink>

                {links.length > 0 && (
                    <nav className="site-nav" aria-label="ניווט ראשי">
                        {links.map((link) => (
                            <NavLink key={link.to} to={link.to} className="site-nav__link">
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                )}

                <div className="site-header__actions">
                    {role ? (
                        <>
                            <span className="site-header__role">{ROLE_NAMES[role]}</span>
                            <button type="button" className="site-header__logout" onClick={logout}>
                                יציאה
                            </button>
                        </>
                    ) : (
                        // אחרי ההתחברות – חוזרים לדף שממנו לחצו
                        <NavLink to="/login" state={{ from: location.pathname + location.search }} className="site-header__login">
                            התחברות
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header