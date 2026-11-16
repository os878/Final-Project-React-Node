import { Link } from "react-router-dom"
import { GifterMark } from "../LandingPage" // סמל הלוגו – מוגדר במקום אחד

// חלקים משותפים לדפי הבית של לקוח, ספק ומנהל

export const GiftMark = () => <GifterMark className="home-hero__mark" size={120} />

export const Arrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
    </svg>
)

// אייקונים בקו פשוט
const ICONS = {
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20" /><circle cx="17" cy="9" r="2.8" /><path d="M16 14a5 5 0 0 1 5.5 5V20" /></>,
    store: <><path d="M4 10v10h16V10" /><path d="M3 10 5 4h14l2 6Z" /><path d="M10 20v-5h4v5" /></>,
    box: <><path d="M3 8l9-5 9 5v8l-9 5-9-5Z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
    plus: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
    chat: <path d="M4 5h16v11H9l-5 4Z" />,
    shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z" /><path d="M12 9v6M9 12h6" /></>,
    tools: <><path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3Z" /><path d="M5 5l4 4M3 7l4-4" /></>,
}

export const HomeCard = ({ to, icon, title, text }) => (
    <Link to={to} className="home-card">
        <span className="home-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[icon]}
            </svg>
        </span>
        <span className="home-card__text">
            <strong>{title}</strong>
            <span>{text}</span>
        </span>
        <span className="home-card__go"><Arrow /></span>
    </Link>
)

export const HomeHero = ({ title, text, to, button }) => (
    <div className="home-hero">
        <div className="home-hero__copy">
            <h2>{title}</h2>
            <p>{text}</p>
            <Link to={to} className="home-hero__btn">
                {button}
                <Arrow />
            </Link>
        </div>
        <GiftMark />
    </div>
)