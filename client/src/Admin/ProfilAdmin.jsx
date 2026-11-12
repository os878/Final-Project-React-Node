import { HomeHero, HomeCard } from "../common/HomeParts"

// דף הבית של המנהל – לוח ניהול

const ProfilAdmin = () => (
    <section className="home">
        <header className="home-head">
            <p className="home-eyebrow">לוח ניהול</p>
            <h1 className="home-title">שלום, מנהל</h1>
            <p className="home-sub">כל ניהול האתר במקום אחד.</p>
        </header>

        <HomeHero
            title="ניהול מוצרים"
            text="כל המוצרים באתר, מכל הספקים: צפייה, עריכה והסרה."
            to="/Admin/AllGifts"
            button="למעבר למוצרים"
        />

        <div className="home-cards home-cards--3">
            <HomeCard to="/Admin/AllCustomers" icon="users" title="ניהול לקוחות" text="כל הלקוחות הרשומים באתר." />
            <HomeCard to="/Admin/AllSuppliers" icon="store" title="ניהול ספקים" text="אישור, עריכה והסרה של ספקים." />
            <HomeCard to="/Admin/AllGifts" icon="box" title="ניהול מוצרים" text="כל המוצרים מכל הספקים." />
            <HomeCard to="/Admin/AddAdmin" icon="shield" title="הוספת מנהל" text="מתן הרשאות ניהול למשתמש נוסף." />
            <HomeCard to="/Admin/MaintenanceManager" icon="tools" title="ניהול תחזוקה" text="הגדרות ותחזוקה של האתר." />
            <HomeCard to="/Admin/AdminDetails" icon="user" title="הפרטים שלי" text="עדכון פרטי החשבון שלכם." />
        </div>
    </section>
)

export default ProfilAdmin