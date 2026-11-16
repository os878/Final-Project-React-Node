const allowedOrigins = [
'http://localhost:3000',
'http://localhost:5500',
"http://localhost:5173",
"http://localhost:5174",
// כתובות האתר החי – מגדירים ב-Render משתנה CLIENT_URL (אפשר כמה, מופרדות בפסיק),
// למשל: https://gifter.vercel.app
...(process.env.CLIENT_URL || '').split(',').map((u) => u.trim().replace(/\/$/, '')).filter(Boolean)
]
const corsOptions = {
origin: (origin, callback) => {
if (allowedOrigins.indexOf(origin) !==-1 || !origin) {
callback(null, true)
} else {
callback(new Error('Not allowed by CORS'))
}
},
credentials: true,
optionsSuccessStatus: 200
}
module.exports = corsOptions