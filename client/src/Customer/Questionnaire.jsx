import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiftContext } from '../context/GiftContext';
import { useLoginGate } from '../common/useLoginGate';

import { Icon, pickIcon } from '../common/OptionIcons'; // האייקונים – משותפים גם לדף התחזוקה
import { API_URL } from '../config'; // כתובת השרת – מוגדרת במקום אחד


/* ---------- אפשרויות קבועות ---------- */
const GENDERS = [
  { value: 'בן', label: 'בן', icon: 'boy' },
  { value: 'בת', label: 'בת', icon: 'girl' },
  { value: 'לא משנה', label: 'לא משנה', icon: 'both' },
];
const STYLES = [
  { value: 'שימושי', icon: 'tools' },
  { value: 'דקורטיבי', icon: 'flower' },
  { value: 'חווייתי', icon: 'ticket' },
  { value: 'אישי/מרגש', icon: 'heart' },
  { value: 'יוקרתי', icon: 'diamond' },
  { value: 'מצחיק/מקורית', icon: 'smile' },
];
const BUDGETS = [100, 200, 300, 500, 1000];
const COLORS = [
  { name: 'לבן', hex: '#FFFFFF' }, { name: 'שחור', hex: '#1E1E22' }, { name: 'כחול', hex: '#2F6FD6' },
  { name: 'ירוק', hex: '#2E8B57' }, { name: 'אדום', hex: '#C8372D' }, { name: 'ורוד', hex: '#E58BB0' },
  { name: 'זהב', hex: '#D9B26A' }, { name: 'כסף', hex: '#B8BEC6' }, { name: 'חום', hex: '#7A5230' },
];

const STEPS = [
  { key: 'who', label: 'למי', icon: 'users' },
  { key: 'event', label: 'אירוע', icon: 'cake' },
  { key: 'relation', label: 'קשר', icon: 'heart' },
  { key: 'style', label: 'סגנון', icon: 'sparkle' },
  { key: 'budget', label: 'תקציב', icon: 'coins' },
];

/* ---------- כרטיס בחירה ---------- */
const OptionCard = ({ selected, onClick, icon, label }) => (
  <button type="button" className={`qz-option ${selected ? 'qz-option--on' : ''}`} aria-pressed={selected} onClick={onClick}>
    <span className="qz-option__check" aria-hidden="true"><Icon name="check" /></span>
    <span className="qz-option__icon"><Icon name={icon} /></span>
    <span className="qz-option__label">{label}</span>
  </button>
);

const Questionnaire = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(''); // 'gifts' / 'ai'
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState(0);

  // מצבים לשמירת האפשרויות שיגיעו מהדאטהבייס
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const { formData, setFormData, setMatchingGifts, setAiInspirations } = useContext(GiftContext);
  const { isLoggedIn, requireLogin } = useLoginGate();

  // טעינת אפשרויות (קטגוריות, אירועים, קשרים) מהשרת בעת עשיית Render ראשוני
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [categoryRes, eventRes, relationshipRes] = await Promise.all([
          Axios.get(`${API_URL}/api/category`, config),
          Axios.get(`${API_URL}/api/event`, config),
          Axios.get(`${API_URL}/api/relationship`, config)
        ]);

        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : categoryRes.data?.data || []);
        setEvents(Array.isArray(eventRes.data) ? eventRes.data : eventRes.data?.data || []);
        setRelationships(Array.isArray(relationshipRes.data) ? relationshipRes.data : relationshipRes.data?.data || []);
      } catch (error) {
        console.error('שגיאה בטעינת אפשרויות מהשרת:', error);
        setErrorMessage('לא ניתן לטעון את אפשרויות הבחירה. נסי לרענן את הדף.');
      }
    };

    fetchOptions();
  }, []);

  // פונקציה 1: חיפוש מתנות מספקים – פתוח לכולם, גם לאורח
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    setIsLoading(true);
    setLoadingType('gifts');
    const fetchMatchingGifts = async () => {
      try {
        const response = await Axios.post(
          `${API_URL}/api/gift/matchGifts`,
          formData
        );
        if (!Array.isArray(response.data?.gifts)) {
          throw new Error('השרת החזיר תשובה לא תקינה');
        }

        setMatchingGifts(response.data.gifts);
        navigate('/results');
      } catch (error) {
        console.error('Error fetching matching gifts:', error);
        setErrorMessage(error.response?.data?.message || error.message || 'לא הצלחנו למצוא מתנות מתאימות');
      } finally {
        setIsLoading(false);
        setLoadingType('');
      }
    };
    fetchMatchingGifts();
  };

  // פונקציה 2: קבלת השראות מבינה מלאכותית
  const handleAiInspirations = async () => {
    setErrorMessage('');

    // השראות AI – רק למחוברים (כל קריאה ל-Gemini עולה כסף). התשובות בשאלון נשמרות בינתיים.
    if (!(await requireLogin('התחברו וקבלו 3 רעיונות מקוריים מה-AI. התשובות שלכם בשאלון יחכו לכם כאן.'))) {
      return;
    }
    const token = localStorage.getItem('token');

    setIsLoading(true);
    setLoadingType('ai');

    try {
      // שולחים גם את השמות (ולא רק את ה-id), כדי שהבינה המלאכותית תבין מה נבחר
      const nameOf = (list, value) => list.find((item) => (item._id || item.name) === value)?.name || '';
      const aiData = {
        ...formData,
        eventName: nameOf(events, formData.event),
        relationshipName: nameOf(relationships, formData.relationship),
        categoryName: nameOf(categories, formData.category),
      };

      const response = await Axios.post(
        `${API_URL}/api/gift/getAiInspirations`,
        aiData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 70000 // זמן קצוב של 70 שניות
        }
      );

      if (response.data?.inspirations) {
        if (setAiInspirations) {
          setAiInspirations(response.data.inspirations);
        }
        navigate('/Giftinspirations', { state: { inspirations: response.data.inspirations } });
      }
    } catch (error) {
      console.error('Error fetching AI inspirations:', error);
      if (error.code === 'ECONNABORTED') {
        setErrorMessage('הבקשה לקחה יותר מדי זמן, אנא נסי שוב.');
      } else {
        setErrorMessage(error.response?.data?.message || 'לא הצלחנו לקבל השראות כעת');
      }
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  /* ---------- עזרים לעדכון התשובות ---------- */
  const setField = (field, value) => setFormData({ ...formData, [field]: value });
  // לחיצה שנייה על אותה בחירה מבטלת אותה
  const toggleField = (field, value) => setField(field, formData[field] === value ? '' : value);

  const toggleStyle = (style) => {
    const current = formData.styles || [];
    setField('styles', current.includes(style) ? current.filter((s) => s !== style) : [...current, style]);
  };

  // צבעים נשמרים כטקסט אחד, למשל "כחול, זהב" (כמו קודם)
  const colorList = (formData.color || '').split(',').map((c) => c.trim()).filter(Boolean);
  const toggleColor = (name) => {
    const next = colorList.includes(name) ? colorList.filter((c) => c !== name) : [...colorList, name];
    setField('color', next.join(', '));
  };

  const changeAge = (diff) => {
    const age = Math.max(0, Math.min(120, (Number(formData.age) || 0) + diff));
    setField('age', String(age));
  };

  const isLast = step === STEPS.length - 1;
  const goTo = (i) => { setErrorMessage(''); setStep(i); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  /* ---------- תוכן כל שלב ---------- */
  const renderStep = () => {
    switch (STEPS[step].key) {
      case 'who':
        return (
          <>
            <div className="qz-q">
              <h2 className="qz-q__title">למי מיועדת המתנה?</h2>
              <p className="qz-q__hint">נתחיל בקטן, ספרו לנו על מי שמקבל.</p>
            </div>
            <div className="qz-options qz-options--3">
              {GENDERS.map((g) => (
                <OptionCard key={g.value} icon={g.icon} label={g.label}
                  selected={formData.forGender === g.value}
                  onClick={() => toggleField('forGender', g.value)} />
              ))}
            </div>

            <div className="qz-field">
              <label htmlFor="qzAge" className="qz-field__label">בן או בת כמה?</label>
              <div className="qz-age">
                <button type="button" className="qz-age__btn" onClick={() => changeAge(-1)} aria-label="הפחתת גיל">−</button>
                <input id="qzAge" type="number" min="0" max="120" inputMode="numeric" placeholder="גיל"
                  className="qz-age__input" value={formData.age}
                  onChange={(e) => setField('age', e.target.value)} />
                <button type="button" className="qz-age__btn" onClick={() => changeAge(1)} aria-label="הוספת גיל">+</button>
              </div>
            </div>
          </>
        );

      case 'event':
        return (
          <>
            <div className="qz-q">
              <h2 className="qz-q__title">לאיזה אירוע?</h2>
              <p className="qz-q__hint">בחרו את האירוע שבשבילו מחפשים מתנה.</p>
            </div>
            <div className="qz-options">
              {events.map((item) => {
                const value = item._id || item.name;
                return (
                  <OptionCard key={item._id || item.id || item.name} icon={pickIcon(item)} label={item.name}
                    selected={formData.event === value} onClick={() => toggleField('event', value)} />
                );
              })}
            </div>
            {events.length === 0 && <p className="qz-empty">טוענים אירועים…</p>}
          </>
        );

      case 'relation':
        return (
          <>
            <div className="qz-q">
              <h2 className="qz-q__title">מה הקשר שלכם?</h2>
              <p className="qz-q__hint">מתנה לאמא שונה ממתנה לחבר מהעבודה.</p>
            </div>
            <div className="qz-options">
              {relationships.map((item) => {
                const value = item._id || item.name;
                return (
                  <OptionCard key={item._id || item.id || item.name} icon={pickIcon(item)} label={item.name}
                    selected={formData.relationship === value} onClick={() => toggleField('relationship', value)} />
                );
              })}
            </div>
            {relationships.length === 0 && <p className="qz-empty">טוענים אפשרויות…</p>}
          </>
        );

      case 'style':
        return (
          <>
            <div className="qz-q">
              <h2 className="qz-q__title">מה הוא אוהב?</h2>
              <p className="qz-q__hint">בחרו תחום, ואיזה סוג מתנה מתאים לו.</p>
            </div>
            <div className="qz-options">
              {categories.map((item) => {
                const value = item._id || item.name;
                return (
                  <OptionCard key={item._id || item.id || item.name} icon={pickIcon(item)} label={item.name}
                    selected={formData.category === value} onClick={() => toggleField('category', value)} />
                );
              })}
            </div>

            <div className="qz-field">
              <span className="qz-field__label">איזה סוג מתנה? <small>אפשר לבחור כמה</small></span>
              <div className="qz-chips">
                {STYLES.map((s) => {
                  const on = (formData.styles || []).includes(s.value);
                  return (
                    <button key={s.value} type="button" className={`qz-chip ${on ? 'qz-chip--on' : ''}`} aria-pressed={on} onClick={() => toggleStyle(s.value)}>
                      <Icon name={s.icon} className="qz-chip__icon" />
                      {s.value}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="qz-switch">
              <input type="checkbox" checked={formData.DedicationPersonalization || false}
                onChange={(e) => setField('DedicationPersonalization', e.target.checked)} />
              <span className="qz-switch__track" aria-hidden="true"><span className="qz-switch__thumb" /></span>
              <span className="qz-switch__text">
                <Icon name="pen" className="qz-switch__icon" />
                חשוב לי שאפשר יהיה להוסיף הקדשה או התאמה אישית
              </span>
            </label>
          </>
        );

      case 'budget':
      default:
        return (
          <>
            <div className="qz-q">
              <h2 className="qz-q__title">כמעט סיימנו!</h2>
              <p className="qz-q__hint">עד כמה רוצים להוציא, ויש צבע שהוא אוהב?</p>
            </div>

            <div className="qz-field">
              <label htmlFor="qzPrice" className="qz-field__label">תקציב מקסימלי</label>
              <div className="qz-price">
                <span className="qz-price__unit" aria-hidden="true">₪</span>
                <input id="qzPrice" type="number" min="0" inputMode="numeric" placeholder="לדוגמה: 200"
                  className="qz-price__input" value={formData.price}
                  onChange={(e) => setField('price', e.target.value)} />
              </div>
              <div className="qz-chips">
                {BUDGETS.map((b) => {
                  const on = String(formData.price) === String(b);
                  return (
                    <button key={b} type="button" className={`qz-chip ${on ? 'qz-chip--on' : ''}`} aria-pressed={on} onClick={() => setField('price', String(b))}>
                      עד {b.toLocaleString('he-IL')} ₪
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="qz-field">
              <span className="qz-field__label">צבע מועדף <small>אפשר לבחור כמה</small></span>
              <div className="qz-colors">
                {COLORS.map((c) => {
                  const on = colorList.includes(c.name);
                  return (
                    <button key={c.name} type="button" className={`qz-color ${on ? 'qz-color--on' : ''}`} aria-pressed={on} onClick={() => toggleColor(c.name)}>
                      <span className="qz-color__swatch" style={{ background: c.hex }} aria-hidden="true" />
                      {c.name}
                    </button>
                  );
                })}
              </div>
              <input type="text" className="qz-text" placeholder="או כתבו בעצמכם, לדוגמה: תכלת"
                aria-label="צבע מועדף" value={formData.color} onChange={(e) => setField('color', e.target.value)} />
            </div>

            <div className="qz-finish">
              <p className="qz-finish__title">איך תרצו לקבל רעיונות?</p>
              <div className="qz-finish__actions">
                <button type="button" className="qz-action qz-action--main" onClick={handleSubmit} disabled={isLoading}>
                  <span className="qz-action__icon"><Icon name="search" /></span>
                  <span className="qz-action__text">
                    <strong>{loadingType === 'gifts' ? 'מחפשים מתנות…' : 'מתנות מוכנות מספקים'}</strong>
                    <span>מוצרים שאפשר להזמין עכשיו</span>
                  </span>
                </button>
                <button type="button" className="qz-action qz-action--ai" onClick={handleAiInspirations} disabled={isLoading}>
                  <span className="qz-action__icon"><Icon name="bulb" /></span>
                  <span className="qz-action__text">
                    <strong>{loadingType === 'ai' ? 'מייצרים השראות…' : 'השראה מבינה מלאכותית'}</strong>
                    <span>
                      {isLoggedIn()
                        ? 'רעיונות מקוריים, בנויים במיוחד בשבילו'
                        : 'התחברו וקבלו 3 רעיונות מקוריים מה-AI'}
                    </span>
                  </span>
                </button>
              </div>
              {loadingType === 'ai' && <p className="qz-wait">זה יכול לקחת כמה רגעים, שווה לחכות.</p>}
            </div>
          </>
        );
    }
  };

  return (
    <section className="qz" dir="rtl">
      <header className="qz-head">
        <p className="qz-eyebrow">שאלון מתנות</p>
        <h1 className="qz-title">בואו נמצא את המתנה המושלמת</h1>
        <p className="qz-sub">חמש שאלות קצרות, ואפשר לדלג על כל מה שלא בטוחים בו.</p>
      </header>

      {/* התקדמות */}
      <ol className="qz-steps" aria-label="שלבי השאלון">
        {STEPS.map((s, i) => (
          <li key={s.key}>
            <button type="button"
              className={`qz-step ${i === step ? 'qz-step--current' : ''} ${i < step ? 'qz-step--done' : ''}`}
              aria-current={i === step ? 'step' : undefined}
              onClick={() => goTo(i)}>
              <span className="qz-step__dot"><Icon name={i < step ? 'check' : s.icon} /></span>
              <span className="qz-step__label">{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="qz-bar" aria-hidden="true">
        <span className="qz-bar__fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      {/* השלב הנוכחי */}
      <div className={`qz-card qz-card--${STEPS[step].key}`} key={step}>
        <span className="qz-card__badge">שאלה {step + 1} מתוך {STEPS.length}</span>
        {renderStep()}

        {errorMessage && (
          <p className="qz-error" role="alert">{errorMessage}</p>
        )}
      </div>

      {/* ניווט */}
      <div className="qz-nav">
        {step > 0 ? (
          <button type="button" className="qz-nav__back" onClick={() => goTo(step - 1)}>
            <Icon name="arrowRight" className="qz-nav__icon" />
            הקודם
          </button>
        ) : <span />}
        {!isLast && (
          <button type="button" className="qz-nav__next" onClick={() => goTo(step + 1)}>
            הבא
            <Icon name="arrowLeft" className="qz-nav__icon" />
          </button>
        )}
      </div>
    </section>
  );
};

export default Questionnaire;