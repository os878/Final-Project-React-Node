import { useState, useEffect } from 'react';
import CustomerItem from './CustomerItem';
import UpdateCustomer from './UpdateCustomer';
import { CloseIcon } from '../common/Icons';

const AllCustomers = () => {
    // מערך הלקוחות שנקבל מהשרת
    const [customers, setCustomers] = useState([]);
    // הלקוח שנבחר לעריכה
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // האם חלון העריכה פתוח
    const [isEditOpen, setIsEditOpen] = useState(false);
    // משתנה לשמירת הודעת שגיאה
    const [error, setError] = useState('');

    // טעינת רשימת הלקוחות מהשרת בעת טעינת הקומפוננטה
    useEffect(() => {
        const getCustomers = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('יש להתחבר למערכת כדי לראות את הלקוחות');
                    return;
                }

                const response = await fetch('http://localhost:7002/api/customer/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('לא הצלחנו לטעון את הלקוחות');
                }

                const data = await response.json();
                setCustomers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        getCustomers();
    }, []);

    // הסרת לקוח מהתצוגה לאחר מחיקה
    const removeCustomer = (customerId) => {
        setCustomers((prev) => prev.filter((item) => item._id !== customerId));
    };

    // פתיחת חלון העריכה
    const openEdit = (customer) => {
        setSelectedCustomer(customer);
        setIsEditOpen(true);
    };

    // סגירת חלון העריכה
    const closeEdit = () => {
        setIsEditOpen(false);
        setSelectedCustomer(null);
    };

    // עדכון הלקוח ברשימה לאחר שמירה
    const updateCustomerInList = (updatedCustomer) => {
        setCustomers((prev) =>
            prev.map((item) =>
                item._id === updatedCustomer._id ? updatedCustomer : item
            )
        );
        closeEdit();
    };

    return (
        <section className="sg" dir="rtl">
            <header className="sg-head">
                <div>
                    <p className="pg-eyebrow">לוח ניהול</p>
                    <h1 className="pg-title">ניהול לקוחות</h1>
                    <p className="pg-sub">{customers.length > 0 ? `${customers.length} לקוחות רשומים באתר` : 'אין עדיין לקוחות להצגה'}</p>
                </div>
            </header>

            {/* הצגת הודעת שגיאה */}
            {error && <p className="pg-error" role="alert">{error}</p>}

            {/* מעבר על כל הפריטים והצגתם */}
            {customers.length > 0 && (
                <div className="ad-grid">
                    {customers.map((customer) => (
                        <CustomerItem
                            key={customer._id}
                            customer={customer}
                            onDelete={removeCustomer}
                            onEdit={openEdit}
                        />
                    ))}
                </div>
            )}

            {/* חלון עריכה */}
            {isEditOpen && selectedCustomer && (
                <div className="gd-overlay" onClick={closeEdit}>
                    <div className="gd-dialog" role="dialog" aria-modal="true" aria-label="עריכת פרטי לקוח" onClick={(e) => e.stopPropagation()}>
                        <div className="gd-dialog__head">
                            <div>
                                <h2 className="gd-dialog__title">עריכת פרטי לקוח</h2>
                                <p className="gd-dialog__sub">{selectedCustomer.name}</p>
                            </div>
                            <button type="button" className="gd-dialog__close" onClick={closeEdit} aria-label="סגירה">
                                <CloseIcon />
                            </button>
                        </div>

                        <UpdateCustomer
                            customer={selectedCustomer}
                            onUpdated={updateCustomerInList}
                        />
                    </div>
                </div>
            )}

            {/* הודעה אם אין מה להציג */}
            {customers.length === 0 && !error && (
                <div className="pg-empty">
                    <h2>אין עדיין לקוחות להצגה</h2>
                </div>
            )}
        </section>
    );
};

export default AllCustomers;