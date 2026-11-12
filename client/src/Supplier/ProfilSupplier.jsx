import { HomeHero, HomeCard } from "../common/HomeParts"

// דף הבית של הספק – מה שהוא רואה מיד אחרי התחברות

const tips = [
    { num: "1", title: "תמונה ברורה", text: "מוצר עם תמונה טובה מושך יותר תשומת לב." },
    { num: "2", title: "תיאור מדויק", text: "למי המוצר מתאים ולאיזה אירוע." },
    { num: "3", title: "מענה מהיר", text: "לקוחות אוהבים תשובה מהירה לפניות." },
]

const ProfilSupplier = () => (
    <section className="home">
        <header className="home-head">
            <p className="home-eyebrow">אזור הספקים</p>
            <h1 className="home-title">ברוכים הבאים!</h1>
            <p className="home-sub">כל מה שצריך כדי שהמוצרים שלכם יגיעו ללקוחות הנכונים.</p>
        </header>

        <HomeHero
            title="יש לכם מוצר חדש?"
            text="מעלים אותו בכמה דקות, והוא מתחיל להופיע ללקוחות שמחפשים בדיוק אותו."
            to="/AddGift"
            button="הוספת מוצר"
        />

        <div className="home-cards home-cards--3">
            <HomeCard to="/Supplier/GiftsList" icon="box" title="המוצרים שלי" text="צפייה ועריכה של כל המוצרים." />
            <HomeCard to="/Supplier/Inquiries" icon="chat" title="פניות לקוחות" text="שאלות והזמנות שהגיעו אליכם." />
            <HomeCard to="/Supplier/SupplierDetails" icon="store" title="פרטי הספק" text="פרטי העסק ופרטי הקשר." />
        </div>

        <div className="home-steps">
            <h2 className="home-steps__title">טיפים למכירה טובה יותר</h2>
            <ol className="home-steps__list">
                {tips.map((s) => (
                    <li key={s.num} className="home-step">
                        <span className="home-step__num">{s.num}</span>
                        <div>
                            <h3>{s.title}</h3>
                            <p>{s.text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    </section>
)

export default ProfilSupplier