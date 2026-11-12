import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useFeedback } from '../common/Feedback';

export const UpdateCustomer = ({ customer, onUpdated }) => {
    const { toast } = useFeedback();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    // מילוי הטופס בנתוני הלקוח המיועד לעריכה
    useEffect(() => {
        if (customer) {
            setName(customer.name || '');
            setUsername(customer.username || '');
            setEmail(customer.email || '');
            setPhone(customer.phone || '');
        }
    }, [customer]);

    const handleInputChange = (setter, value) => {
        setter(value);
        if (errorMessage) setErrorMessage('');
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!name || !username || !email || !phone) {
            setErrorMessage('יש למלא שם, שם משתמש, אימייל וטלפון');
            return;
        }

        try {
            const customerData = {
                id: customer._id,
                name,
                username,
                email,
                phone
            };


            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data } = await Axios.put(
                'http://localhost:7002/api/customer',
                customerData,
                config
            );

            toast('פרטי הלקוח עודכנו בהצלחה!', "success");

            if (onUpdated) {
                onUpdated(data.customer || data);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('אירעה שגיאה בעת עדכון פרטי הלקוח');
            }
        }
    };

    return (
        <div>
            <h2>עריכת פרטי לקוח</h2>
            <form onSubmit={submitForm}>
                
                {/* שם מלא */}
                <label htmlFor="customerName">שם מלא</label>
                <input
                    id="customerName"
                    type="text"
                    value={name}
                    onChange={(e) => handleInputChange(setName, e.target.value)}
                />

                {/* שם משתמש */}
                <label htmlFor="username">שם משתמש</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => handleInputChange(setUsername, e.target.value)}
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

export default UpdateCustomer;