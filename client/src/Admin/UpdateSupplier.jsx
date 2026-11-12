import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useFeedback } from '../common/Feedback';

export const UpdateSupplier = ({ supplier, onUpdated }) => {
    const { toast } = useFeedback();
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    // מילוי הטופס בנתוני הספק המיועד לעריכה
    useEffect(() => {
        if (supplier) {
            setName(supplier.name || '');
            setCompanyName(supplier.companyName || '');
            setEmail(supplier.email || '');
            setPhone(supplier.phone || '');
        }
    }, [supplier]);

    const handleInputChange = (setter, value) => {
        setter(value);
        if (errorMessage) setErrorMessage('');
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!name || !email || !phone) {
            setErrorMessage('יש למלא שם, אימייל וטלפון');
            return;
        }

        try {
            const supplierData = {
                _id: supplier._id,
                id: supplier._id,
                name,
                companyName,
                email,
                phone
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data } = await Axios.put(
                'http://localhost:7002/api/supplier',
                supplierData,
                config
            );

            toast('פרטי הספק עודכנו בהצלחה!', "success");

            if (onUpdated) {
                onUpdated(data.supplier || data);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('אירעה שגיאה בעת עדכון פרטי הספק');
            }
        }
    };

    return (
        <div className="fm" dir="rtl">
            <div className="fm-head">
                <h2 className="fm-title">עריכת פרטי ספק</h2>
            </div>
            <form className="fm-form" onSubmit={submitForm}>
                <div className="fm-grid">
                    <div className="fm-field">
                        <label htmlFor="supplierName">שם איש קשר</label>
                        <input
                            id="supplierName"
                            type="text"
                            value={name}
                            onChange={(e) => handleInputChange(setName, e.target.value)}
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="companyName">שם החברה</label>
                        <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(e) => handleInputChange(setCompanyName, e.target.value)}
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="email">אימייל</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => handleInputChange(setEmail, e.target.value)}
                        />
                    </div>
                    <div className="fm-field">
                        <label htmlFor="phone">מספר טלפון</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => handleInputChange(setPhone, e.target.value)}
                        />
                    </div>
                </div>

                {errorMessage && (
                    <p className="pg-error" role="alert">{errorMessage}</p>
                )}

                <button type="submit" className="ag-submit">שמירת שינויים</button>
            </form>
        </div>
    );
};

export default UpdateSupplier;