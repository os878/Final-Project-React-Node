import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export const UpdateSupplier = ({ supplier, onUpdated }) => {
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

            alert('פרטי הספק עודכנו בהצלחה!');

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
        <div>
            <h2>עריכת פרטי ספק</h2>
            <form onSubmit={submitForm}>
                
                {/* שם איש קשר / ספק */}
                <label htmlFor="supplierName">שם איש קשר</label>
                <input
                    id="supplierName"
                    type="text"
                    value={name}
                    onChange={(e) => handleInputChange(setName, e.target.value)}
                />

                {/* שם חברה */}
                <label htmlFor="companyName">שם החברה</label>
                <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => handleInputChange(setCompanyName, e.target.value)}
                />

                {/* דואר אלקטרוני */}
                <label htmlFor="email">אימייל</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange(setEmail, e.target.value)}
                />

                {/* טלפון */}
                <label htmlFor="phone">מספר טלפון</label>
                <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => handleInputChange(setPhone, e.target.value)}
                />

                {errorMessage && (
                    <p style={{ color: 'red' }}>{errorMessage}</p>
                )}

                <button type="submit">שמירת שינויים</button>
            </form>
        </div>
    );
};

export default UpdateSupplier;