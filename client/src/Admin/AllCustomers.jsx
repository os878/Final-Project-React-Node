import { useState, useEffect } from 'react';
import CustomerItem from './CustomerItem';
import UpdateCustomer from './UpdateCustomer';

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
        <div>
            <h1>ניהול לקוחות</h1>

            {/* הצגת הודעת שגיאה */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* מעבר על כל הלקוחות והצגתם */}
            {customers.map((customer) => (
                <CustomerItem
                    key={customer._id}
                    customer={customer}
                    onDelete={removeCustomer}
                    onEdit={openEdit}
                />
            ))}

            {/* חלון מודאלי לעריכת לקוח */}
            {isEditOpen && selectedCustomer && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            width: '500px',
                            maxWidth: '90%'
                        }}
                    >
                        <button onClick={closeEdit}>סגירה ✕</button>

                        <UpdateCustomer
                            customer={selectedCustomer}
                            onUpdated={updateCustomerInList}
                        />
                    </div>
                </div>
            )}

            {/* הודעה אם אין לקוחות להצגה */}
            {customers.length === 0 && !error && (
                <p>אין עדיין לקוחות להצגה</p>
            )}
        </div>
    );
};

export default AllCustomers;