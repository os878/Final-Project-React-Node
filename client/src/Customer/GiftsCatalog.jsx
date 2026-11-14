import { useEffect, useMemo, useState } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useFeedback } from '../common/Feedback';

const API = 'http://localhost:7002';

// ===== אייקונים =====
const Svg = ({ children, filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);
const HeartIcon = ({ filled }) => <Svg filled={filled}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></Svg>;
const GiftIcon = () => <Svg><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" /></Svg>;
const ArrowIcon = () => <Svg><path d="M19 12H5m0 0 7 7m-7-7 7-7" /></Svg>;
const SearchIcon = () => <Svg><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></Svg>;

// טווחי מחיר לסינון
const PRICE_RANGES = [
    { key: 'all', label: 'כל המחירים', min: 0, max: Infinity },
    { key: 'p1', label: 'עד 100 ₪', min: 0, max: 100 },
    { key: 'p2', label: '100 עד 250 ₪', min: 100, max: 250 },
    { key: 'p3', label: '250 עד 500 ₪', min: 250, max: 500 },
    { key: 'p4', label: 'מעל 500 ₪', min: 500, max: Infinity },
];

const SORTS = [
    { key: 'new', label: 'הכי חדשות' },
    { key: 'cheap', label: 'מחיר: מהנמוך לגבוה' },
    { key: 'expensive', label: 'מחיר: מהגבוה לנמוך' },
];

const nameOf = (field) => (field && typeof field === 'object' ? field.name : '');
const idOf = (field) => (field && typeof field === 'object' ? String(field._id) : String(field || ''));

const GiftsCatalog = () => {
    const { toast } = useFeedback();

    const [gifts, setGifts] = useState([]);
    // רשימות הקטגוריות והאירועים – נטענות מהשרת (כמו בשאלון)
    const [allCategories, setAllCategories] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // סינון ומיון (רק תצוגה)
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [event, setEvent] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sort, setSort] = useState('new');

    // טעינת המתנות והמועדפים
    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const asList = (res) => (Array.isArray(res.data) ? res.data : res.data?.data || []);
                const [giftsRes, favRes, catRes, eventRes] = await Promise.all([
                    Axios.get(`${API}/api/gift/getAllGifts`, config),
                    Axios.get(`${API}/api/favorite`, config).catch(() => ({ data: [] })),
                    Axios.get(`${API}/api/category`, config).catch(() => ({ data: [] })),
                    Axios.get(`${API}/api/event`, config).catch(() => ({ data: [] })),
                ]);
                setGifts(asList(giftsRes));
                setFavorites(asList(favRes));
                setAllCategories(asList(catRes));
                setAllEvents(asList(eventRes));
            } catch (err) {
                setError(err.response?.data?.message || 'לא ניתן לטעון את המתנות');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // הוספה / הסרה מהמועדפים (כמו בדף תוצאות השאלון)
    const toggleFavorite = async (giftId) => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const isFavorite = favorites.some((f) => f.gift?._id === giftId);
        try {
            if (isFavorite) {
                await Axios.delete(`${API}/api/favorite/${giftId}`, config);
                setFavorites((prev) => prev.filter((f) => f.gift?._id !== giftId));
                toast('המתנה הוסרה מהמועדפים', 'info');
            } else {
                const response = await Axios.post(`${API}/api/favorite`, { giftId }, config);
                setFavorites((prev) => [...prev, { _id: response.data?.favorite?._id, gift: { _id: giftId } }]);
                toast('המתנה נשמרה במועדפים', 'success');
            }
        } catch (err) {
            toast(err.response?.data?.message || 'שגיאה בעדכון המועדפים', 'error');
        }
    };

    // אפשרויות הסינון: מהרשימות שבשרת, רק כאלה שיש להן לפחות מתנה אחת
    const usedCategoryIds = useMemo(() => new Set(gifts.map((g) => idOf(g.category))), [gifts]);
    const usedEventIds = useMemo(() => new Set(gifts.map((g) => idOf(g.event))), [gifts]);

    const categories = useMemo(() => allCategories
        .map((c) => ({ id: String(c._id), name: c.name }))
        .filter((c) => usedCategoryIds.has(c.id)), [allCategories, usedCategoryIds]);

    const events = useMemo(() => allEvents
        .map((ev) => ({ id: String(ev._id), name: ev.name }))
        .filter((ev) => usedEventIds.has(ev.id)), [allEvents, usedEventIds]);

    // שם הקטגוריה של מתנה – גם אם השרת שלח רק id
    const categoryName = (gift) => nameOf(gift.category)
        || allCategories.find((c) => String(c._id) === idOf(gift.category))?.name
        || '';

    // המתנות שמוצגות אחרי סינון ומיון
    const shown = useMemo(() => {
        const text = search.trim().toLowerCase();
        const range = PRICE_RANGES.find((r) => r.key === priceRange);
        const list = gifts.filter((g) => {
            const price = Number(g.price) || 0;
            if (text && !`${g.name || ''} ${g.description || ''}`.toLowerCase().includes(text)) return false;
            if (category !== 'all' && idOf(g.category) !== category) return false;
            if (event !== 'all' && idOf(g.event) !== event) return false;
            if (price < range.min || price > range.max) return false;
            return true;
        });
        if (sort === 'cheap') return [...list].sort((a, b) => Number(a.price) - Number(b.price));
        if (sort === 'expensive') return [...list].sort((a, b) => Number(b.price) - Number(a.price));
        return list; // השרת כבר מחזיר מהחדשה לישנה
    }, [gifts, search, category, event, priceRange, sort]);

    const hasFilters = search || category !== 'all' || event !== 'all' || priceRange !== 'all';
    const clearFilters = () => {
        setSearch('');
        setCategory('all');
        setEvent('all');
        setPriceRange('all');
    };

    if (loading) return <p className="gd-state" role="status">טוען מתנות…</p>;
    if (error) return <p className="gd-state gd-state--error" role="alert">{error}</p>;

    return (
        <section className="pg cat" dir="rtl">
            <header className="pg-head">
                <p className="pg-eyebrow">כל המתנות</p>
                <h1 className="pg-title">מדפדפים ומוצאים השראה</h1>
                <p className="pg-sub">כל המתנות של הספקים שלנו במקום אחד. אהבתם משהו? שמרו אותו במועדפים.</p>
            </header>

            {/* סרגל חיפוש וסינון */}
            <div className="cat-bar">
                <div className="cat-bar__row">
                    <div className="cat-search">
                        <label htmlFor="catSearch" className="sr-only">חיפוש מתנה</label>
                        <span className="cat-search__icon"><SearchIcon /></span>
                        <input
                            id="catSearch"
                            type="search"
                            placeholder="חיפוש לפי שם או תיאור…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="cat-select">
                        <label htmlFor="catEvent">אירוע</label>
                        <select id="catEvent" value={event} onChange={(e) => setEvent(e.target.value)}>
                            <option value="all">כל האירועים</option>
                            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                        </select>
                    </div>

                    <div className="cat-select">
                        <label htmlFor="catSort">מיון</label>
                        <select id="catSort" value={sort} onChange={(e) => setSort(e.target.value)}>
                            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                    </div>
                </div>

                {categories.length > 0 && (
                    <div className="cat-chips" role="group" aria-label="סינון לפי קטגוריה">
                        <button type="button" className={`qz-chip ${category === 'all' ? 'qz-chip--on' : ''}`} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
                            כל הקטגוריות
                        </button>
                        {categories.map((c) => (
                            <button key={c.id} type="button" className={`qz-chip ${category === c.id ? 'qz-chip--on' : ''}`} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                                {c.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="cat-chips" role="group" aria-label="סינון לפי מחיר">
                    {PRICE_RANGES.map((r) => (
                        <button key={r.key} type="button" className={`cat-price ${priceRange === r.key ? 'cat-price--on' : ''}`} aria-pressed={priceRange === r.key} onClick={() => setPriceRange(r.key)}>
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="cat-count">
                <span>{shown.length === gifts.length ? `${gifts.length} מתנות` : `${shown.length} מתוך ${gifts.length} מתנות`}</span>
                {hasFilters && (
                    <button type="button" className="cat-clear" onClick={clearFilters}>ניקוי הסינון</button>
                )}
            </div>

            {shown.length === 0 ? (
                <div className="pg-empty">
                    <span className="pg-empty__icon"><GiftIcon /></span>
                    <h2>לא נמצאו מתנות</h2>
                    <p>אפשר לנקות את הסינון, או לתת לשאלון למצוא בשבילכם.</p>
                    <div className="cat-empty__actions">
                        {hasFilters && <button type="button" className="ins-btn ins-btn--ghost" onClick={clearFilters}>ניקוי הסינון</button>}
                        <Link to="/Customer/Questionnaire" className="pg-btn">לשאלון</Link>
                    </div>
                </div>
            ) : (
                <div className="pg-grid">
                    {shown.map((gift) => {
                        const isFavorite = favorites.some((f) => f.gift?._id === gift._id);
                        return (
                            <article key={gift._id} className="pg-card">
                                <div className="pg-card__media">
                                    {gift.image ? (
                                        <img src={gift.image} alt={gift.name} className="pg-card__img" />
                                    ) : (
                                        <span className="pg-card__placeholder"><GiftIcon /></span>
                                    )}
                                    {categoryName(gift) && <span className="pg-card__score">{categoryName(gift)}</span>}
                                    <button
                                        type="button"
                                        className={`pg-fav ${isFavorite ? 'pg-fav--on' : ''}`}
                                        onClick={() => toggleFavorite(gift._id)}
                                        aria-label={isFavorite ? `הסרה מהמועדפים: ${gift.name}` : `הוספה למועדפים: ${gift.name}`}
                                        aria-pressed={isFavorite}
                                    >
                                        <HeartIcon filled={isFavorite} />
                                    </button>
                                </div>

                                <div className="pg-card__body">
                                    <h2 className="pg-card__title">{gift.name}</h2>
                                    {gift.supplier?.companyName && <span className="cat-supplier">{gift.supplier.companyName}</span>}
                                    <p className="pg-card__text">{gift.description}</p>

                                    <div className="pg-card__footer">
                                        <span className="pg-card__price">{gift.price} ₪</span>
                                        <Link to={`/Customer/GiftDetails/${gift._id}`} className="pg-card__link">
                                            לפרטים נוספים
                                            <ArrowIcon />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default GiftsCatalog;