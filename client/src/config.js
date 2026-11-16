// כתובת השרת (ה-API) – מוגדרת במקום אחד לכל האתר.
// במחשב (פיתוח): http://localhost:7002
// באתר החי (Vercel): מגדירים משתנה סביבה VITE_API_URL = הכתובת מ-Render, למשל https://gifter-api.onrender.com
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:7002').replace(/\/$/, '');
