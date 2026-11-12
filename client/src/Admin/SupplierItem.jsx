import React from 'react';
import { useFeedback } from '../common/Feedback';
import { EditIcon, TrashIcon, MailIcon, PhoneIcon, UserIcon, StoreIcon } from '../common/Icons';

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
        <article className="ad-card supplier-item">
            <div className="ad-card__top">
                <span className="ad-avatar" aria-hidden="true">{(supplier.name || '?').trim().charAt(0)}</span>
                <div className="ad-card__head">
                    <h3 className="ad-card__name">{supplier.name}</h3>
                    <span className="ad-card__sub">{supplier.companyName || 'ספק'}</span>
                </div>
            </div>

            <ul className="ad-rows">
                {supplier.companyName && (
                    <li className="ad-row"><StoreIcon className="ad-row__icon" /><span className="ad-row__label">שם חברה</span><span>{supplier.companyName}</span></li>
                )}
                <li className="ad-row"><MailIcon className="ad-row__icon" /><span className="ad-row__label">אימייל</span><bdi>{supplier.email|| 'לא צוין'}</bdi></li>
                <li className="ad-row"><PhoneIcon className="ad-row__icon" /><span className="ad-row__label">טלפון</span><bdi>{supplier.phone|| 'לא צוין'}</bdi></li>
            </ul>

            <div className="ad-card__actions">
                <button type="button" className="sgi-btn" onClick={() => onEdit(supplier)}>
                    <EditIcon />
                    עריכה
                </button>
                <button type="button" className="sgi-btn sgi-btn--danger" onClick={handleDelete} aria-label={`מחיקת ${supplier.name}`}>
                    <TrashIcon />
                </button>
            </div>
        </article>
    );
};

export default SupplierItem