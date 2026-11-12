import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// לאן הכפתורים מובילים
const START_ROUTE = '/login';
// הנתיב של דף הכניסה (AuthPage) כפי שמוגדר ב-App.jsx
const AUTH_ROUTE = '/login';
// פותח את דף הכניסה ישר על "הרשמה" עם "הרשמה כספק" מסומן
const SUPPLIER_ROUTE = `/login?mode=register&role=supplier`;

/* ---------- לוגו ---------- */

const BulbIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 40 46" aria-hidden="true">
    <circle cx="20" cy="17" r="13" fill="#D9B26A" />
    <rect x="14" y="33" width="12" height="4" rx="2" fill="#2A1A14" />
    <rect x="16" y="39" width="8" height="4" rx="2" fill="#2A1A14" />
  </svg>
);

export const GifterMark = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
    <g stroke="#D9B26A" strokeWidth="2" strokeLinecap="round">
      <line x1="60" y1="6" x2="60" y2="10" />
      <line x1="44" y1="13" x2="46.5" y2="16" />
      <line x1="76" y1="13" x2="73.5" y2="16" />
    </g>
    <circle cx="60" cy="29" r="11" fill="none" stroke="#D9B26A" strokeWidth="2.5" />
    <path d="M55.5 31 Q60 23 64.5 31" fill="none" stroke="#D9B26A" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="55" y1="42" x2="65" y2="42" stroke="#2A1A14" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="56.5" y1="45.5" x2="63.5" y2="45.5" stroke="#2A1A14" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="24" y="62" width="72" height="48" rx="3" fill="#7A1F2B" />
    <rect x="18" y="50" width="84" height="14" rx="2.5" fill="#7A1F2B" />
    <rect x="18" y="62" width="84" height="2" fill="#2A1A14" opacity="0.35" />
    <rect x="57.5" y="50" width="5" height="60" fill="#D9B26A" />
  </svg>
);

export const GifterLogo = ({ size = 48, showSlogan = false }) => (
  <div className="gifter-logo">
    <GifterMark size={size} />
    <div className="gifter-logo__text">
      <span className="sr-only">Gifter</span>
      <span className="gifter-wordmark" dir="ltr" aria-hidden="true">
        G
        <span className="gifter-wordmark__i">
          ı
          <BulbIcon className="gifter-wordmark__bulb" />
        </span>
        fter
      </span>
      {showSlogan && (
        <span className="gifter-slogan">
          מוצאים בקלות, <em>מעניקים בכיף.</em>
        </span>
      )}
    </div>
  </div>
);

/* ---------- תוכן ---------- */

const steps = [
  {
    title: 'מספרים לנו על מי שמקבל',
    text: 'כמה שאלות קצרות: למי המתנה, מה הוא אוהב, לאיזה אירוע ומה התקציב.',
  },
  {
    title: 'מקבלים המלצות מדויקות',
    text: 'רק כמה רעיונות שבאמת מתאימים, וליד כל אחד הסבר קצר למה דווקא הוא.',
  },
  {
    title: 'בוחרים ומעניקים',
    text: 'מזמינים מוצר מוכן מספק, או לוקחים את הרעיון ומגשימים אותו בעצמכם.',
  },
];

const paths = [
  {
    tag: 'מוכן להזמנה',
    title: 'מוצרים מספקים',
    text: 'מתנות קיימות מספקים מובחרים, שמותאמות לתשובות שלכם ואפשר להזמין אותן מיד.',
    tone: 'navy',
  },
  {
    tag: 'רעיון מקורי',
    title: 'השראה מבינה מלאכותית',
    text: 'רעיונות יצירתיים שלא הייתם חושבים עליהם לבד, בנויים בדיוק סביב מי שמקבל.',
    tone: 'spark',
  },
];

const occasions = ['יום הולדת', 'חגים', 'בר מצווה', 'חתונה', 'מתנה למורה', 'מתנות לעובדים', 'תודה', 'סתם כי בא לי'];

const reasons = [
  { title: 'בלי לנחש', text: 'ההמלצות נבנות לפי מי שמקבל, לא לפי מה שנמכר הכי הרבה.' },
  { title: 'בלי לחפש שעות', text: 'במקום לגלול בין אלפי מוצרים, מקבלים כמה בחירות טובות.' },
  { title: 'כל הכיף נשאר לכם', text: 'אנחנו עושים את העבודה הקשה, אתם נהנים מהרגע של הנתינה.' },
];

const supplierPerks = [
  {
    title: 'פוגשים קונים ברגע הנכון',
    text: 'מי שמגיע ל-Gifter כבר החליט לקנות מתנה. הוא רק מחפש מה. בדיוק שם המוצר שלכם מופיע.',
  },
  {
    title: 'לא נבלעים בין אלפי מוצרים',
    text: 'הקונה רואה רק כמה המלצות שמתאימות לו. כשהמוצר שלכם מתאים, הוא בולט ולא נקבר בעמוד העשרים.',
  },
  {
    title: 'מצטרפים בקלות',
    text: 'מעלים את המוצרים, מסמנים למי ולאיזה אירוע הם מתאימים, ואנחנו דואגים להתאמה.',
  },
];

/* ---------- עמוד ---------- */

const LandingPage = () => {
  const navigate = useNavigate();
  const start = (occasion) =>
    navigate(START_ROUTE, occasion ? { state: { occasion } } : undefined);

  return (
    <div className="gp" dir="rtl">
      <header className="gp-header">
        <div className="gp-container gp-header__inner">
          <GifterLogo size={40} />
          <div className="gp-header__actions">
            <a href="#suppliers" className="gp-header__link">לספקים</a>
            <button type="button" className="gp-btn gp-btn--small" onClick={() => start()}>
              למצוא מתנה
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="gp-hero">
          <div className="gp-container gp-hero__inner">
            <div className="gp-hero__copy">
              <p className="gp-eyebrow">מתנות בהתאמה אישית</p>
              <h1 className="gp-hero__title">
                מוצאים בקלות,
                <br />
                <span>מעניקים בכיף.</span>
              </h1>
              <p className="gp-hero__lead">
                עונים על כמה שאלות קצרות על מי שמקבל את המתנה, ומקבלים רעיונות שמתאימים בדיוק לו:
                מוצרים מוכנים מספקים, או השראה למתנה מקורית. בלי לחפש שעות, ובלי לנחש.
              </p>
              <div className="gp-hero__actions">
                <button type="button" className="gp-btn gp-btn--large" onClick={() => start()}>
                  אז יאלה שנתחיל?
                </button>
                <span className="gp-hero__note">כמה שאלות קצרות, ותוצאות מיד</span>
              </div>
            </div>

            <div className="gp-hero__visual" aria-hidden="true">
              <div className="gp-hero__card">
                <GifterMark size={150} />
                <span className="gp-chip gp-chip--a">לאבא</span>
                <span className="gp-chip gp-chip--b">אוהב טבע ובישול</span>
                <span className="gp-chip gp-chip--c">עד 200 ₪</span>
                <span className="gp-chip gp-chip--d">יום הולדת</span>
              </div>
            </div>
          </div>
        </section>

        {/* איך זה עובד */}
        <section className="gp-section">
          <div className="gp-container">
            <h2 className="gp-section__title">איך זה עובד?</h2>
            <ol className="gp-steps">
              {steps.map((s, i) => (
                <li key={s.title} className="gp-step">
                  <span className="gp-step__num">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* שתי דרכים */}
        <section className="gp-section gp-section--tint">
          <div className="gp-container">
            <h2 className="gp-section__title">שתי דרכים למתנה המושלמת</h2>
            <div className="gp-paths">
              {paths.map((p) => (
                <article key={p.title} className={`gp-path gp-path--${p.tone}`}>
                  <span className="gp-path__tag">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* אירועים */}
        <section className="gp-section">
          <div className="gp-container">
            <h2 className="gp-section__title">לאיזה אירוע?</h2>
            <p className="gp-section__sub">בחרו אירוע והשאלון יתחיל משם.</p>
            <div className="gp-occasions">
              {occasions.map((o) => (
                <button key={o} type="button" className="gp-occasion" onClick={() => start(o)}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* למה */}
        <section className="gp-section gp-section--tint">
          <div className="gp-container">
            <h2 className="gp-section__title">למה Gifter?</h2>
            <div className="gp-reasons">
              {reasons.map((r) => (
                <div key={r.title} className="gp-reason">
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ספקים */}
        <section id="suppliers" className="gp-section gp-suppliers" aria-labelledby="suppliers-title">
          <div className="gp-container gp-suppliers__inner">
            <div className="gp-suppliers__copy">
              <p className="gp-eyebrow">לספקים ולבעלי עסקים</p>
              <h2 id="suppliers-title" className="gp-suppliers__title">
                הלקוחות שלכם כבר מחפשים מתנה.
                <br />
                <span>תנו להם למצוא אתכם.</span>
              </h2>
              <p className="gp-suppliers__lead">
                יש לכם מוצר שיכול לשמח מישהו? ב-Gifter הוא מגיע ישר למי שמחפש בדיוק אותו,
                ברגע שהוא מוכן לקנות.
              </p>
            </div>

            <ul className="gp-perks">
              {supplierPerks.map((p) => (
                <li key={p.title} className="gp-perk">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>

            <div className="gp-suppliers__bottom">
              <p className="gp-suppliers__early">
                אנחנו בונים עכשיו את נבחרת הספקים הראשונה. מצטרפים עכשיו? אתם שם מההתחלה.
              </p>
              <button type="button" className="gp-btn gp-btn--large gp-btn--spark" onClick={() => navigate(SUPPLIER_ROUTE)}>
                אני רוצה להציע את המוצרים שלי
              </button>
            </div>
          </div>
        </section>

        {/* קריאה לפעולה */}
        <section className="gp-cta">
          <div className="gp-container gp-cta__inner">
            <h2>המתנה הבאה שלכם במרחק כמה שאלות.</h2>
            <button type="button" className="gp-btn gp-btn--large" onClick={() => start()}>
              אז יאלה שנתחיל?
            </button>
          </div>
        </section>
      </main>

      <footer className="gp-footer">
        <div className="gp-container gp-footer__inner">
          <GifterLogo size={32} showSlogan />
          <span>© {new Date().getFullYear()} Gifter</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
