import { useState, useEffect } from 'react';
import SupplierItem from './SupplierItem';
import UpdateSupplier from './UpdateSupplier';
import { CloseIcon } from '../common/Icons';

const AllSuppliers = () => {
    // מערך הספקים שנקבל מהשרת
    const [suppliers, setSuppliers] = useState([]);
    // הספק שנבחר לעריכה
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    // האם חלון העריכה פתוח
    const [isEditOpen, setIsEditOpen] = useState(false);
    // משתנה לשמירת הודעת שגיאה
    const [error, setError] = useState('');

    // טעינת רשימת הספקים מהשרת בעת טעינת הקומפוננטה
    useEffect(() => {
        const getSuppliers = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('יש להתחבר למערכת כדי לראות את הספקים');
                    return;
                }

                const response = await fetch('http://localhost:7002/api/supplier/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('לא הצלחנו לטעון את הספקים');
                }

                const data = await response.json();
                setSuppliers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        getSuppliers();
    }, []);

    // הסרת ספק מהתצוגה לאחר מחיקה
    const removeSupplier = (supplierId) => {
        setSuppliers((prev) => prev.filter((item) => item._id !== supplierId));
    };

    // פתיחת חלון העריכה
    const openEdit = (supplier) => {
        setSelectedSupplier(supplier);
        setIsEditOpen(true);
    };

    // סגירת חלון העריכה
    const closeEdit = () => {
        setIsEditOpen(false);
        setSelectedSupplier(null);
    };

    // עדכון הספק ברשימה לאחר שמירה
    const updateSupplierInList = (updatedSupplier) => {
        setSuppliers((prev) =>
            prev.map((item) =>
                item._id === updatedSupplier._id ? updatedSupplier : item
            )
        );
        closeEdit();
    };

    return (
        <section className="sg" dir="rtl">
            <header className="sg-head">
                <div>
                    <p className="pg-eyebrow">לוח ניהול</p>
                    <h1 className="pg-title">ניהול ספקים</h1>
                    <p className="pg-sub">{suppliers.length > 0 ? `${suppliers.length} ספקים רשומים באתר` : 'אין עדיין ספקים להצגה'}</p>
                </div>
            </header>

            {/* הצגת הודעת שגיאה */}
            {error && <p className="pg-error" role="alert">{error}</p>}

            {/* מעבר על כל הפריטים והצגתם */}
            {suppliers.length > 0 && (
                <div className="ad-grid">
                    {suppliers.map((supplier) => (
                        <SupplierItem
                            key={supplier._id}
                            supplier={supplier}
                            onDelete={removeSupplier}
                            onEdit={openEdit}
                        />
                    ))}
                </div>
            )}

            {/* חלון עריכה */}
            {isEditOpen && selectedSupplier && (
                <div className="gd-overlay" onClick={closeEdit}>
                    <div className="gd-dialog" role="dialog" aria-modal="true" aria-label="עריכת פרטי ספק" onClick={(e) => e.stopPropagation()}>
                        <div className="gd-dialog__head">
                            <div>
                                <h2 className="gd-dialog__title">עריכת פרטי ספק</h2>
                                <p className="gd-dialog__sub">{selectedSupplier.companyName || selectedSupplier.name}</p>
                            </div>
                            <button type="button" className="gd-dialog__close" onClick={closeEdit} aria-label="סגירה">
                                <CloseIcon />
                            </button>
                        </div>

                        <UpdateSupplier
                            supplier={selectedSupplier}
                            onUpdated={updateSupplierInList}
                        />
                    </div>
                </div>
            )}

            {/* הודעה אם אין מה להציג */}
            {suppliers.length === 0 && !error && (
                <div className="pg-empty">
                    <h2>אין עדיין ספקים להצגה</h2>
                </div>
            )}
        </section>
    );
};

export default AllSuppliers