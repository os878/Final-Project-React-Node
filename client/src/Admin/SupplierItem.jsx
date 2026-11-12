import React from 'react';
import { useFeedback } from '../common/Feedback';

const SupplierItem = ({ supplier, onDelete, onEdit }) => {
    const { toast, confirm } = useFeedback();
    const handleDelete = async () => {
        const ok = await confirm({
            title: 'מחיקת ספק',
            message: 'האם אתה בטוח שברצונך למחוק ספק זה?',
            confirmText: 'מחיקה',
            cancelText: 'ביטול',
            danger: true
        });
        if (!ok) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:7002/api/supplier/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id: supplier._id })
            });

            if (!response.ok) {
                throw new Error('מחיקת הספק נכשלה');
            }

            onDelete(supplier._id);
        } catch (error) {
            toast(error.message, "error");
        }
    };

    return (
        <div
            className="supplier-item"
            style={{
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '8px'
            }}
        >
            <h3>{supplier.name}</h3>

            {supplier.companyName && (
                <p><strong>שם חברה:</strong> {supplier.companyName}</p>
            )}
            <p><strong>אימייל:</strong> {supplier.email|| 'לא צוין'}</p>
            <p><strong>טלפון:</strong> {supplier.phone|| 'לא צוין'}</p>

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => onEdit(supplier)}>
                    עריכה
                </button>
                <button onClick={handleDelete}>
                    מחיקה
                </button>
            </div>
        </div>
    );
};

export default SupplierItem