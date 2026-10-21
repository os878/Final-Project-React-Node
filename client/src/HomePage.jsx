import React from 'react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate('/admin-login')}>לכניסת מנהל</button>
      <button onClick={() => navigate('/Supplier/Login')}>לכניסת ספק</button>
      <button>לכניסת לקוח</button>
    </div>
  )
}

export default HomePage