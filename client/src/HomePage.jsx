import React from 'react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate()
  return (
    <div>
      <h1>ברוכים הבאים ל-Gifter</h1>
      <p>קודם בואו נתחבר...</p>
      <button onClick={() => navigate('/admin-login')}>לכניסת מנהל</button>
      <button onClick={() => navigate('/Supplier/Login')}>לכניסת ספק</button>
      <button onClick={() => navigate('/Customer/LoginCustomer')}>לכניסת לקוח</button>
    </div>
  )
}

export default HomePage