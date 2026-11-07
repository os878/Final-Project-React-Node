import { useState, useEffect } from 'react';
import SupplierItem from './SupplierItem';
import UpdateSupplier from './UpdateSupplier';

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
        <div>
            <h1>ניהול ספקים</h1>

            {/* הצגת הודעת שגיאה */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* מעבר על כל הספקים והצגתם */}
            {suppliers.map((supplier) => (
                <SupplierItem
                    key={supplier._id}
                    supplier={supplier}
                    onDelete={removeSupplier}
                    onEdit={openEdit}
                />
            ))}

            {/* חלון מודאלי לעריכת ספק */}
            {isEditOpen && selectedSupplier && (
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

                        <UpdateSupplier
                            supplier={selectedSupplier}
                            onUpdated={updateSupplierInList}
                        />
                    </div>
                </div>
            )}

            {/* הודעה אם אין ספקים להצגה */}
            {suppliers.length === 0 && !error && (
                <p>אין עדיין ספקים להצגה</p>
            )}
        </div>
    );
};

export default AllSuppliers