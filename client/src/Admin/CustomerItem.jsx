import React from 'react';
import { useFeedback } from '../common/Feedback';
import { EditIcon, TrashIcon, MailIcon, PhoneIcon, UserIcon, StoreIcon } from '../common/Icons';

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
        <article className="ad-card customer-item">
            <div className="ad-card__top">
                <span className="ad-avatar" aria-hidden="true">{(customer.name || '?').trim().charAt(0)}</span>
                <div className="ad-card__head">
                    <h3 className="ad-card__name">{customer.name}</h3>
                    <span className="ad-card__sub">לקוח</span>
                </div>
            </div>

            <ul className="ad-rows">
                <li className="ad-row"><UserIcon className="ad-row__icon" /><span className="ad-row__label">שם משתמש</span><bdi>{customer.username}</bdi></li>
                <li className="ad-row"><MailIcon className="ad-row__icon" /><span className="ad-row__label">אימייל</span><bdi>{customer.email}</bdi></li>
                <li className="ad-row"><PhoneIcon className="ad-row__icon" /><span className="ad-row__label">טלפון</span><bdi>{customer.phone}</bdi></li>
            </ul>

            <div className="ad-card__actions">
                <button type="button" className="sgi-btn" onClick={() => onEdit(customer)}>
                    <EditIcon />
                    עריכה
                </button>
                <button type="button" className="sgi-btn sgi-btn--danger" onClick={handleDelete} aria-label={`מחיקת ${customer.name}`}>
                    <TrashIcon />
                </button>
            </div>
        </article>
    );
};

export default CustomerItem;