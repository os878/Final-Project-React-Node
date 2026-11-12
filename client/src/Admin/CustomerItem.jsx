import React from 'react';
import { useFeedback } from '../common/Feedback';

const CustomerItem = ({ customer, onDelete, onEdit }) => {
    const { toast, confirm } = useFeedback();
    const handleDelete = async () => {
        const ok = await confirm({
            title: 'מחיקת לקוח',
            message: 'האם אתה בטוח שברצונך למחוק לקוח זה?',
            confirmText: 'מחיקה',
            cancelText: 'ביטול',
            danger: true
        });
        if (!ok) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:7002/api/customer/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id: customer._id })
            });

            if (!response.ok) {
                throw new Error('מחיקת הלקוח נכשלה');
            }

            onDelete(customer._id);
        } catch (error) {
            toast(error.message, "error");
        }
    };

    return (
        <div
            className="customer-item"
            style={{
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '8px'
            }}
        >
            <h3>{customer.name}</h3>

            <p><strong>שם משתמש:</strong> {customer.username}</p>
            <p><strong>אימייל:</strong> {customer.email}</p>
            <p><strong>טלפון:</strong> {customer.phone}</p>

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => onEdit(customer)}>
                    עריכה
                </button>
                <button onClick={handleDelete}>
                    מחיקה
                </button>
            </div>
        </div>
    );
};

export default CustomerItem;