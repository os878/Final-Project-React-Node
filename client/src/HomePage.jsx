import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* כפתור כניסה ראשי ללקוחות */}
            <button onClick={() => navigate('/login')}>
                התחברות / הרשמה
            </button>

            {/* קישור עדין להרשמת ספקים */}
            <p>
                בעל עסק או ספק מתנות?{' '}
                <span 
                    onClick={() => navigate('/login?mode=register&role=supplier')} 
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                    הצטרפות כספק
                </span>
            </p>
        </div>
    );
};

export default HomePage;