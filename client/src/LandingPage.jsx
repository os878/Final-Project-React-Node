import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { GiftContext } from './context/GiftContext';
import './LandingPage.css';

const API = 'http://localhost:7002';

// לאן הכפתורים מובילים
const START_ROUTE = '/questionnaire'; // השאלון פתוח גם לאורח
const CATALOG_ROUTE = '/gifts';
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

/* ---------- אייקונים (קו פשוט, בסגנון האתר) ---------- */

const ICONS = {
  arrow: <path d="M19 12H5m0 0 7 7m-7-7 7-7" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  store: <><path d="M4 10v10h16V10" /><path d="M3 10 5 4h14l2 6Z" /><path d="M10 20v-5h4v5" /></>,
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />,
  chat: <path d="M4 5h16v11H9l-5 4Z" />,
  woman: <><circle cx="12" cy="7" r="3.5" /><path d="M8.5 6.5c0-3 7-3 7 0M6 21l2-7h8l2 7" /></>,
  man: <><circle cx="12" cy="7" r="3.5" /><path d="M6 21v-3a6 6 0 0 1 12 0v3" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  friends: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20" /><circle cx="17" cy="9" r="2.8" /><path d="M16 14a5 5 0 0 1 5.5 5V20" /></>,
  kid: <><circle cx="12" cy="10" r="6" /><path d="M9.5 10h.01M14.5 10h.01M10 13c1 .8 3 .8 4 0M9 20h6" /></>,
  teacher: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>,
  work: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 13h18" /></>,
  gift: <><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" /></>,
};

const Icon = ({ name, className = 'gp-icon' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/* ---------- תוכן ---------- */

// "למי המתנה?" – כל עיגול ממלא מראש את השאלון לפי הנתונים שקיימים במערכת.
// rel = שם הקשר כפי שהוא שמור במסד הנתונים, gender = מגדר (לא חובה)
const RECIPIENTS = [
  { label: 'אמא', rel: 'משפחה', gender: 'בת', icon: 'woman' },
  { label: 'אבא', rel: 'משפחה', gender: 'בן', icon: 'man' },
  { label: 'בן/בת זוג', rel: 'בן/בת זוג', icon: 'heart' },
  { label: 'חבר/ה', rel: 'חבר/ה', icon: 'friends' },
  { label: 'ילד/ה', rel: 'משפחה', icon: 'kid' },
  { label: 'מורה', rel: 'אחר', icon: 'teacher' },
  { label: 'עמית לעבודה', rel: 'קולגה לעבודה', icon: 'work' },
];

// האירועים שמוצגים קודם ב"לאיזה אירוע?" – מגוונים, בלי שניים דומים (כמו חתונה ואירוסין).
// השמות כפי שהם שמורים במסד הנתונים. אירוע שלא קיים או בלי מתנות – פשוט מדלגים עליו.
const PREFERRED_EVENTS = ['יום הולדת', 'אירוסין', 'הולדת תינוק', 'חג', 'מעבר דירה', 'הודיה/הערכה'];

const steps = [
  { title: 'עונים על כמה שאלות', text: 'למי המתנה, לאיזה אירוע ומה התקציב.' },
  { title: 'מקבלים מתנות מתאימות', text: 'מסודרות לפי אחוז ההתאמה.' },
  { title: 'ועוד שלושה רעיונות מקוריים', text: 'הצעות מבינה מלאכותית, למשתמשים רשומים.' },
];

// אותו נרמול שמות כמו בשאלון: "הודיה /הערכה" = "הודיה/הערכה"
const normalize = (name) => (name || '').toString().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').trim();
const asList = (res) => (Array.isArray(res.data) ? res.data : res.data?.data || []);
const formatPrice = (price) => `${Number(price).toLocaleString('he-IL')} ₪`;
const categoryOf = (gift) => (Array.isArray(gift.categories) ? gift.categories[0]?.name : '') || '';

/* ---------- עמוד ---------- */

const LandingPage = () => {
  const navigate = useNavigate();
  const { setFormData } = useContext(GiftContext);

  const [featured, setFeatured] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  // כל הנתונים כאן ציבוריים – לא צריך התחברות
  useEffect(() => {
    Promise.all([
      Axios.get(`${API}/api/gift/featured`).catch(() => ({ data: [] })),
      Axios.get(`${API}/api/gift/getAllGifts`).catch(() => ({ data: [] })),
      Axios.get(`${API}/api/relationship`).catch(() => ({ data: [] })),
      Axios.get(`${API}/api/event`).catch(() => ({ data: [] })),
    ])
      .then(([featuredRes, giftsRes, relRes, eventRes]) => {
        setFeatured(asList(featuredRes));
        setGifts(asList(giftsRes));
        setRelationships(asList(relRes));
        setEvents(asList(eventRes));
      })
      .finally(() => setLoading(false));
  }, []);

  // "לאיזה אירוע?" – 6 אירועים, כל אחד עם תמונה של מתנה אמיתית מהאירוע.
  //   סדר: קודם האירועים שב-PREFERRED_EVENTS (מגוונים, בלי כפילויות כמו חתונה/אירוסין),
  //   ואחריהם השאר לפי מספר המתנות – כך גם אירוע חדש שהמנהל מוסיף יכול להופיע.
  //   תמונה: קודם – המתנה שהמנהל בחר לאירוע בדף התחזוקה (coverGift).
  //   אם לא נבחרה – מעדיפים מתנה "ייעודית" לאירוע (שמתאימה למעט אירועים),
  //   שעוד לא הופיעה בדף (לא בפסיפס, לא במתנות הנבחרות ולא באירוע אחר).
  const occasions = useMemo(() => {
    const byEvent = new Map();
    gifts.forEach((gift) => {
      if (!gift.image) return;
      (gift.events || []).forEach((ev) => {
        if (!ev || typeof ev !== 'object') return;
        const entry = byEvent.get(String(ev._id)) || { id: String(ev._id), name: ev.name, gifts: [] };
        entry.gifts.push(gift);
        byEvent.set(entry.id, entry);
      });
    });

    const rank = (e) => {
      const i = PREFERRED_EVENTS.indexOf(normalize(e.name));
      return i === -1 ? PREFERRED_EVENTS.length : i;
    };
    const coverOf = new Map(events.map((ev) => [String(ev._id), String(ev.coverGift || '')]));
    const chosen = [...byEvent.values()]
      .sort((a, b) => rank(a) - rank(b) || b.gifts.length - a.gifts.length)
      .slice(0, 6);

    // קודם התמונות שהמנהל בחר – כדי שהבחירה האוטומטית לא "תתפוס" אותן לאירוע אחר
    const used = new Set(featured.map((g) => g.image));
    const picked = new Map();
    chosen.forEach((e) => {
      const cover = e.gifts.find((g) => String(g._id) === coverOf.get(e.id));
      if (cover) {
        picked.set(e.id, cover.image);
        used.add(cover.image);
      }
    });

    return chosen.map((e) => {
      if (!picked.has(e.id)) {
        const bySpecific = [...e.gifts].sort((a, b) => (a.events?.length || 0) - (b.events?.length || 0));
        const pick = bySpecific.find((g) => !used.has(g.image)) || bySpecific[0];
        used.add(pick.image);
        picked.set(e.id, pick.image);
      }
      return { id: e.id, name: e.name, image: picked.get(e.id) };
    });
  }, [gifts, featured, events]);

  const heroGifts = featured.slice(0, 3);

  // לחיצה על "אמא" וכו': מתחילים שאלון חדש, כשהקשר (והמגדר) כבר מסומנים
  const startFor = (recipient) => {
    const rel = relationships.find((r) => normalize(r.name) === normalize(recipient.rel));
    setFormData((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((key) => [key, ''])),
      relationship: rel ? (rel._id || rel.name) : '',
      forGender: recipient.gender || '',
    }));
    navigate(START_ROUTE);
  };

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `${CATALOG_ROUTE}?q=${encodeURIComponent(q)}` : CATALOG_ROUTE);
  };

  return (
    <div className="gp" dir="rtl">
      {/* Hero */}
      <section className="gp-hero">
        <div className="gp-container gp-hero__inner">
          <div className="gp-hero__copy">
            <p className="gp-eyebrow">מתנות מעסקים מובחרים</p>
            <h1 className="gp-hero__title">
              מוצאים בקלות,
              <br />
              <em>מעניקים בכיף.</em>
            </h1>
            <p className="gp-hero__lead">
              מתנות מחנויות ויוצרים, ושאלון קצר שמוצא את זו שמתאימה בדיוק למי שמקבל.
            </p>

            <div className="gp-hero__actions">
              <Link to={START_ROUTE} className="gp-btn gp-btn--large">
                מצאו לי מתנה
                <Icon name="arrow" className="gp-btn__icon" />
              </Link>
              <Link to={CATALOG_ROUTE} className="gp-link-btn">לכל המתנות</Link>
            </div>

            <form className="gp-search" role="search" onSubmit={search}>
              <Icon name="search" className="gp-search__icon" />
              <label htmlFor="gpSearch" className="sr-only">חיפוש מתנה</label>
              <input
                id="gpSearch"
                type="search"
                className="gp-search__input"
                placeholder='חיפוש מתנה, למשל "אגרטל"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="gp-search__btn">חיפוש</button>
            </form>

            <ul className="gp-trust">
              <li><Icon name="store" />עסקים מקומיים</li>
              <li><Icon name="spark" />התאמה אישית</li>
              <li><Icon name="chat" />קשר ישיר עם הספק</li>
            </ul>
          </div>

          <div className={`gp-mosaic ${loading ? 'gp-mosaic--loading' : ''}`}>
            {(heroGifts.length ? heroGifts : [null, null, null]).map((gift, i) =>
              gift ? (
                <Link key={gift._id} to={`/gift/${gift._id}`} className={`gp-tile ${i === 0 ? 'gp-tile--big' : ''}`}>
                  <img src={gift.image} alt={gift.name} className="gp-tile__img" />
                  <span className="gp-tile__label">
                    <span>{gift.name}</span>
                    <b>{formatPrice(gift.price)}</b>
                  </span>
                </Link>
              ) : (
                <span key={i} className={`gp-tile gp-tile--empty ${i === 0 ? 'gp-tile--big' : ''}`} aria-hidden="true" />
              )
            )}
          </div>
        </div>
      </section>

      {/* למי המתנה? */}
      <section className="gp-section gp-section--tight" aria-labelledby="gpWho">
        <div className="gp-container">
          <h2 id="gpWho" className="gp-section__title">למי המתנה?</h2>
          <div className="gp-who">
            {RECIPIENTS.map((r) => (
              <button key={r.label} type="button" className="gp-who__item" onClick={() => startFor(r)}>
                <span className="gp-who__icon"><Icon name={r.icon} /></span>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* לאיזה אירוע? */}
      {occasions.length > 0 && (
        <section className="gp-section gp-section--tint" aria-labelledby="gpEvents">
          <div className="gp-container">
            <div className="gp-section__head">
              <h2 id="gpEvents" className="gp-section__title">לאיזה אירוע?</h2>
              <Link to={CATALOG_ROUTE} className="gp-more">כל המתנות<Icon name="arrow" /></Link>
            </div>
            <div className="gp-events">
              {occasions.map((o) => (
                <Link key={o.id} to={`${CATALOG_ROUTE}?event=${o.id}`} className="gp-event">
                  <img src={o.image} alt="" className="gp-event__img" />
                  <span className="gp-event__name">{o.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* מתנות שאוהבים עכשיו */}
      {featured.length > 0 && (
        <section className="gp-section" aria-labelledby="gpFeatured">
          <div className="gp-container">
            <div className="gp-section__head">
              <h2 id="gpFeatured" className="gp-section__title">מתנות שאוהבים עכשיו</h2>
              <Link to={CATALOG_ROUTE} className="gp-more">לכל המתנות<Icon name="arrow" /></Link>
            </div>
            <div className="gp-products">
              {featured.map((gift) => (
                <Link key={gift._id} to={`/gift/${gift._id}`} className="gp-product">
                  <span className="gp-product__media">
                    <img src={gift.image} alt="" className="gp-product__img" />
                    {categoryOf(gift) && <span className="gp-product__tag">{categoryOf(gift)}</span>}
                  </span>
                  <span className="gp-product__name">{gift.name}</span>
                  <span className="gp-product__price">{formatPrice(gift.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* לא בטוחים? */}
      <section className="gp-section gp-section--tint" aria-labelledby="gpHow">
        <div className="gp-container gp-how">
          <div>
            <h2 id="gpHow" className="gp-section__title">לא בטוחים? תנו לנו לבחור</h2>
            <ol className="gp-steps">
              {steps.map((s, i) => (
                <li key={s.title} className="gp-step">
                  <span className="gp-step__num">{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link to={START_ROUTE} className="gp-btn gp-btn--large">
              להתחלת השאלון
              <Icon name="arrow" className="gp-btn__icon" />
            </Link>
          </div>

          {/* המחשה של השאלון */}
          <div className="gp-preview" aria-hidden="true">
            <div className="gp-preview__bar"><i className="on" /><i className="on" /><i className="on" /><i /><i /></div>
            <p className="gp-preview__step">שלב 3 מתוך 5</p>
            <p className="gp-preview__q">מה הקשר שלכם?</p>
            <div className="gp-preview__opts">
              <span className="gp-preview__opt on"><Icon name="friends" />משפחה</span>
              <span className="gp-preview__opt"><Icon name="heart" />בן/בת זוג</span>
              <span className="gp-preview__opt"><Icon name="work" />עמית לעבודה</span>
            </div>
            <p className="gp-preview__ai"><Icon name="spark" />ובסוף: 3 רעיונות מקוריים מה-AI</p>
          </div>
        </div>
      </section>

      {/* ספקים – פס קטן ומאופק */}
      <section className="gp-section gp-section--tight">
        <div className="gp-container">
          <div className="gp-suppliers">
            <p><strong>ספק מתנות?</strong> הציגו את המוצרים שלכם למי שכבר מחפש מתנה.</p>
            <Link to={SUPPLIER_ROUTE} className="gp-suppliers__link">הצטרפות כספק</Link>
          </div>
        </div>
      </section>

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
