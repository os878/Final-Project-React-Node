import { useState, useEffect, useMemo } from 'react';
import GiftItem from './GiftItem';
import UpdateGift from './UpdateGift';
import { CloseIcon } from '../common/Icons';
import { API_URL } from '../config'; // כתובת השרת – מוגדרת במקום אחד

const AllGifts = () => {
    const [gifts, setGifts] = useState([]);
    const [selectedGift, setSelectedGift] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [error, setError] = useState('');

    // מצבי סינון
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        const getGifts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('יש להתחבר למערכת כדי לראות את המתנות');
                    return;
                }

                const response = await fetch(`${API_URL}/api/gift/getAllGifts`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('לא הצלחנו לטעון את המתנות');
                }

                const data = await response.json();
                setGifts(data);
            } catch (err) {
                setError(err.message);
            }
        };

        getGifts();
    }, []);

    // חילוץ רשימות ייחודיות מתוך המתנות
    const filterOptions = useMemo(() => {
        const suppliersMap = new Map();
        const categoriesMap = new Map();
        const eventsMap = new Map();

        gifts.forEach((gift) => {
            if (gift.supplier) {
                const isObj = typeof gift.supplier === 'object';
                const supId = isObj ? gift.supplier._id : gift.supplier;
                const supName = isObj
                    ? (
                        gift.supplier.businessName ||
                        gift.supplier.companyName ||
                        gift.supplier.name ||
                        gift.supplier.fullName ||
                        gift.supplier.username ||
                        gift.supplier.email ||
                        'ספק ללא שם'
                    )
                    : `ספק (${String(supId).slice(-4)})`;

                if (supId) suppliersMap.set(supId, supName);
            }

            const cats = Array.isArray(gift.categories) ? gift.categories : (gift.category ? [gift.category] : []);
            cats.forEach((c) => {
                if (c && typeof c === 'object' && c._id) {
                    categoriesMap.set(c._id, c.name);
                }
            });

            const evs = Array.isArray(gift.events) ? gift.events : (gift.event ? [gift.event] : []);
            evs.forEach((e) => {
                if (e && typeof e === 'object' && e._id) {
                    eventsMap.set(e._id, e.name);
                }
            });
        });

        return {
            suppliers: Array.from(suppliersMap, ([id, name]) => ({ id, name })),
            categories: Array.from(categoriesMap, ([id, name]) => ({ id, name })),
            events: Array.from(eventsMap, ([id, name]) => ({ id, name })),
        };
    }, [gifts]);

    const filteredGifts = useMemo(() => {
        return gifts.filter((gift) => {
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const inName = gift.name?.toLowerCase().includes(q);
                const inDesc = gift.description?.toLowerCase().includes(q);
                if (!inName && !inDesc) return false;
            }

            if (selectedSupplier) {
                const supId = typeof gift.supplier === 'object' ? gift.supplier?._id : gift.supplier;
                if (supId !== selectedSupplier) return false;
            }

            if (selectedCategory) {
                const cats = Array.isArray(gift.categories) ? gift.categories : (gift.category ? [gift.category] : []);
                const hasCat = cats.some((c) => (typeof c === 'object' ? c._id : c) === selectedCategory);
                if (!hasCat) return false;
            }

            if (selectedEvent) {
                const evs = Array.isArray(gift.events) ? gift.events : (gift.event ? [gift.event] : []);
                const hasEvent = evs.some((e) => (typeof e === 'object' ? e._id : e) === selectedEvent);
                if (!hasEvent) return false;
            }

            if (selectedGender && gift.forGender !== selectedGender) {
                return false;
            }

            if (maxPrice !== '' && Number(gift.price) > Number(maxPrice)) {
                return false;
            }

            return true;
        });
    }, [gifts, searchTerm, selectedSupplier, selectedCategory, selectedEvent, selectedGender, maxPrice]);

    const hasActiveFilters = searchTerm || selectedSupplier || selectedCategory || selectedEvent || selectedGender || maxPrice !== '';

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedSupplier('');
        setSelectedCategory('');
        setSelectedEvent('');
        setSelectedGender('');
        setMaxPrice('');
    };

    const removeGift = (giftId) => {
        setGifts((prevGifts) => prevGifts.filter((gift) => gift._id !== giftId));
    };

    const openEdit = (gift) => {
        setSelectedGift(gift);
        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setIsEditOpen(false);
        setSelectedGift(null);
    };

    const updateGiftInList = (updatedGift) => {
        setGifts((prevGifts) =>
            prevGifts.map((item) => (item._id === updatedGift._id ? updatedGift : item))
        );
        closeEdit();
    };

    return (
        <section className="sg" dir="rtl">
            <header className="sg-head">
                <div>
                    <p className="pg-eyebrow">לוח ניהול</p>
                    <h1 className="pg-title">ניהול מתנות</h1>
                    <p className="pg-sub">
                        {gifts.length > 0
                            ? `מציג ${filteredGifts.length} מתוך ${gifts.length} מתנות באתר`
                            : 'אין עדיין מתנות להצגה'}
                    </p>
                </div>
            </header>

            {/* סרגל סינון מעוצב ב-Grid */}
            {gifts.length > 0 && (
                <div
                    style={{
                        backgroundColor: '#fff',
                        padding: '18px 20px',
                        borderRadius: '18px',
                        border: '1px solid #e7e2d8',
                        marginBottom: '26px',
                        boxShadow: '0 4px 14px rgba(43, 38, 32, 0.04)'
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                            gap: '12px',
                            alignItems: 'end'
                        }}
                    >
                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>חיפוש חופשי</label>
                            <input
                                type="text"
                                placeholder="שם או תיאור מתנה..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={controlStyle}
                            />
                        </div>

                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>ספק</label>
                            <select
                                value={selectedSupplier}
                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                style={controlStyle}
                            >
                                <option value="">כל הספקים</option>
                                {filterOptions.suppliers.map((sup) => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>קטגוריה</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={controlStyle}
                            >
                                <option value="">כל הקטגוריות</option>
                                {filterOptions.categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>אירוע</label>
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                style={controlStyle}
                            >
                                <option value="">כל האירועים</option>
                                {filterOptions.events.map((ev) => (
                                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>מגדר</label>
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                                style={controlStyle}
                            >
                                <option value="">הכל</option>
                                <option value="בן">בן</option>
                                <option value="בת">בת</option>
                                <option value="לא משנה">לא משנה</option>
                            </select>
                        </div>

                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>מחיר עד (₪)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="ללא הגבלה"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                style={controlStyle}
                            />
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button
                                type="button"
                                onClick={resetFilters}
                                style={{
                                    padding: '7px 16px',
                                    borderRadius: '999px',
                                    border: '1px solid #d6cfc2',
                                    backgroundColor: '#f7f4ee',
                                    color: '#2b2620',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                ✕ ניקוי סינון
                            </button>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="pg-error" role="alert">{error}</p>}

            {filteredGifts.length > 0 && (
                <div className="sg-grid">
                    {filteredGifts.map((gift) => (
                        <GiftItem
                            key={gift._id}
                            gift={gift}
                            onDelete={removeGift}
                            onEdit={openEdit}
                        />
                    ))}
                </div>
            )}

            {gifts.length > 0 && filteredGifts.length === 0 && !error && (
                <div className="pg-empty">
                    <h2>לא נמצאו מתנות התואמות לסינון</h2>
                    <button type="button" className="sgi-btn" onClick={resetFilters} style={{ marginTop: '12px' }}>
                        איפוס מסננים
                    </button>
                </div>
            )}

            {isEditOpen && selectedGift && (
                <div className="gd-overlay" onClick={closeEdit}>
                    <div className="gd-dialog" role="dialog" aria-modal="true" aria-label="עריכת מתנה" onClick={(e) => e.stopPropagation()}>
                        <div className="gd-dialog__head">
                            <div>
                                <h2 className="gd-dialog__title">עריכת מתנה</h2>
                                <p className="gd-dialog__sub">{selectedGift.name}</p>
                            </div>
                            <button type="button" className="gd-dialog__close" onClick={closeEdit} aria-label="סגירה">
                                <CloseIcon />
                            </button>
                        </div>

                        <UpdateGift
                            gift={selectedGift}
                            onUpdated={updateGiftInList}
                        />
                    </div>
                </div>
            )}

            {gifts.length === 0 && !error && (
                <div className="pg-empty">
                    <h2>אין עדיין מתנות להצגה</h2>
                </div>
            )}
        </section>
    );
};

const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: 0
};

const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#6b6257',
    paddingRight: '4px'
};

const controlStyle = {
    width: '100%',
    height: '40px',
    padding: '0 12px',
    borderRadius: '10px',
    border: '1px solid #dcd6ca',
    backgroundColor: '#fcfbf9',
    color: '#2b2620',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
    outline: 'none'
};

export default AllGifts;