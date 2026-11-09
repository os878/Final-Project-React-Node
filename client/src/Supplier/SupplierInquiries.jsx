import { useEffect, useState } from 'react';
import Axios from 'axios';

const SupplierInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const handleStatusChange = async (inquiryId, newStatus) => {
        const token = localStorage.getItem('token');

        try {
            await Axios.patch(
                `http://localhost:7002/api/inquiry/${inquiryId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setInquiries(prev =>
                prev.map(inquiry =>
                    inquiry._id === inquiryId
                        ? { ...inquiry, status: newStatus }
                        : inquiry
                )
            );

        } catch (error) {
            console.error('שגיאה בעדכון סטטוס:', error);
            setError(error.response?.data?.message || 'לא ניתן לעדכן את הסטטוס');
        }
    };
    useEffect(() => {
        const fetchInquiries = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await Axios.get(
                    'http://localhost:7002/api/inquiry/supplier',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setInquiries(response.data);
                console.log('הפניות שהתקבלו:', response.data);

            } catch (error) {
                console.error('שגיאה בטעינת הפניות:', error);
                setError(
                    error.response?.data?.message || 'לא ניתן לטעון את הפניות'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    if (loading) return <p>טוען פניות...</p>;
    if (error) return <p>{error}</p>;


    return (
        <div dir="rtl">
            <h2>פניות לקוחות</h2>

            {inquiries.length === 0 ? (
                <p>עדיין לא התקבלו פניות</p>
            ) : (
                inquiries.map(inquiry => (
                    <div key={inquiry._id}>
                        <h3>פנייה עבור: {inquiry.gift?.name}</h3>

                        <p>שם הלקוח: {inquiry.name}</p>
                        <p>טלפון: {inquiry.phone}</p>
                        <p>מייל: {inquiry.email || 'לא צוין'}</p>

                        <p>הודעה: {inquiry.message}</p>

                        <p>
                            דרך התקשרות מועדפת: {inquiry.preferredContact}
                        </p>

                        <p>
                            תאריך הפנייה:
                            {new Date(inquiry.createdAt).toLocaleDateString('he-IL')}
                        </p>

                        <p>סטטוס: {inquiry.status}</p>
                        <select
                            value={inquiry.status}
                            onChange={(e) =>
                                handleStatusChange(inquiry._id, e.target.value)
                            }
                        >
                            <option value="New">פנייה חדשה</option>
                            <option value="InProgress">בטיפול</option>
                            <option value="Handled">טופלה</option>
                        </select>
                    </div>
                ))
            )}
        </div>
    );

};

export default SupplierInquiries;