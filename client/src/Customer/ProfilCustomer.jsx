import { HomeHero, HomeCard } from "../common/HomeParts"

// דף הבית של הלקוח – מה שהוא רואה מיד אחרי התחברות

const steps = [
    { num: "1", title: "מספרים על מי שמקבל", text: "למי המתנה, מה הוא אוהב ומה התקציב." },
    { num: "2", title: "מקבלים המלצות", text: "רק רעיונות שבאמת מתאימים לו." },
    { num: "3", title: "שומרים ומעניקים", text: "מה שאהבתם נשמר במועדפים." },
]

const ProfileCustomer = () => (
    <section className="home">
        <header className="home-head">
            <p className="home-eyebrow">האזור האישי</p>
            <h1 className="home-title">שמחים שחזרתם!</h1>
            <p className="home-sub">למי מחפשים מתנה הפעם?</p>
        </header>

        <HomeHero
            title="מוצאים את המתנה המושלמת"
            text="עונים על כמה שאלות קצרות, ומקבלים רעיונות שמתאימים בדיוק למי שמקבל."
            to="/Customer/Questionnaire"
            button="למצוא מתנה חדשה"
        />

        <div className="home-cards">
            <HomeCard to="/Customer/Favorites" icon="heart" title="המועדפים שלי" text="כל המתנות ששמרתם, במקום אחד." />
            <HomeCard to="/Customer/CusromerDetails" icon="user" title="הפרטים שלי" text="עדכון שם, טלפון ואימייל." />
        </div>

        <div className="home-steps">
            <h2 className="home-steps__title">איך זה עובד?</h2>
            <ol className="home-steps__list">
                {steps.map((s) => (
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

export default ProfileCustomer