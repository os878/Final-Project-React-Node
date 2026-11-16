import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// לאן הכפתורים מובילים
const START_ROUTE = '/questionnaire'; // השאלון פתוח גם לאורח
// הנתיב של דף הכניסה (AuthPage) כפי שמוגדר ב-App.jsx
const AUTH_ROUTE = '/login';
// פותח את דף הכניסה ישר על "הרשמה" עם "הרשמה כספק" מסומן
const SUPPLIER_ROUTE = `/login?mode=register&role=supplier`;

/* ---------- לוגו ---------- */

// סמל: קופסת מתנה עם ניצוץ של רעיון (צבעי המותג קבועים, לא תלויים במשתנים)
export const GifterMark = ({ size = 48, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M47 3l2.6 7.4L57 13l-7.4 2.6L47 23l-2.6-7.4L37 13l7.4-2.6Z" fill="#FFC93C" />
    <path d="M32 26c-3-6-11-8-11-3.5S28 26 32 26Zm0 0c3-6 11-8 11-3.5S36 26 32 26Z" fill="none" stroke="#CF3439" strokeWidth="3" strokeLinejoin="round" />
    <rect x="8" y="26" width="48" height="10" rx="3" fill="#CF3439" />
    <rect x="12" y="35" width="40" height="23" rx="3.5" fill="#CF3439" />
    <rect x="12" y="35" width="40" height="2.5" fill="#B42A30" />
    <rect x="29.5" y="26" width="5" height="32" fill="#FFC93C" />
  </svg>
);

// השם עם e אדומה – משותף לכל מקום שבו מופיע הלוגו
export const GifterWordmark = ({ className = 'gifter-wordmark' }) => (
  <>
    <span className="sr-only">Gifter</span>
    <span className={className} dir="ltr" aria-hidden="true">
      Gift<span className="gifter-wordmark__e">e</span>r
    </span>
  </>
);

export const GifterLogo = ({ size = 48, showSlogan = false }) => (
  <div className="gifter-logo">
    <GifterMark size={size} />
    <div className="gifter-logo__text">
      <GifterWordmark />
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
    text: ' כמה רעיונות שבאמת מתאימים, וליד כל אחד הסבר קצר למה דווקא הוא.',
  },
  {
    title: 'בוחרים ומעניקים',
    text: 'מזמינים מתנה מוכנה מחנות מובחרת, או לוקחים את הרעיון ומגשימים אותו בעצמכם.',
  },
];

const paths = [
  {
    tag: 'מוכן להזמנה',
    title: 'מתנות מחנויות ומותגים',
    text: 'מתנות קיימות מעסקים מובחרים, שמותאמות לתשובות שלכם ואפשר להזמין אותן מיד.',
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
            <a href="#suppliers" className="gp-header__link">לבעלי עסקים</a>
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
                מתנות מוכנות ממותגים וחנויות, או השראה למתנה מקורית. בלי לחפש שעות, ובלי לנחש.
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

        {/* עסקים וחנויות */}
        <section id="suppliers" className="gp-section gp-suppliers" aria-labelledby="suppliers-title">
          <div className="gp-container gp-suppliers__inner">
            <div className="gp-suppliers__copy">
              <p className="gp-eyebrow">לבעלי עסקים, חנויות ויוצרים</p>
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
                אנחנו בונים עכשיו את נבחרת העסקים והמותגים הראשונה. מצטרפים עכשיו? אתם שם מההתחלה.
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