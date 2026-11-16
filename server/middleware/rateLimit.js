// ===== הגבלת ניסיונות (rate limit) – בלי חבילות חיצוניות =====
// סופר בקשות לכל "מפתח" (כתובת IP או משתמש) בחלון זמן, וחוסם עם 429 כשעוברים את המכסה.
// הספירה נשמרת בזיכרון של השרת: מתאפסת כשהשרת עולה מחדש. לפרויקט בגודל הזה זה מספיק.

const makeRateLimit = ({ windowMs, max, key = (req) => req.ip, message }) => {
    const hits = new Map() // key → { count, resetAt }

    // ניקוי רשומות ישנות כל כמה דקות, כדי שהזיכרון לא יגדל
    setInterval(() => {
        const now = Date.now()
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
    }, Math.min(windowMs, 10 * 60 * 1000)).unref()

    return (req, res, next) => {
        const k = key(req)
        const now = Date.now()
        let entry = hits.get(k)
        if (!entry || entry.resetAt <= now) {
            entry = { count: 0, resetAt: now + windowMs }
            hits.set(k, entry)
        }
        entry.count++

        res.set('RateLimit-Limit', String(max))
        res.set('RateLimit-Remaining', String(Math.max(0, max - entry.count)))
        if (entry.count > max) {
            res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))
            return res.status(429).json({ message })
        }
        next()
    }
}

// התחברות: כל ניסיון בדף ההתחברות בודק עד 3 נתיבים (לקוח, ספק, מנהל),
// לכן 30 בקשות ב-15 דקות ≈ 10 ניסיונות התחברות אמיתיים מאותה כתובת
const loginLimiter = makeRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    key: (req) => 'login:' + req.ip,
    message: 'יותר מדי ניסיונות התחברות. נסו שוב בעוד כמה דקות.',
})

// הרשמה: 10 חשבונות בשעה מאותה כתובת
const registerLimiter = makeRateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    key: (req) => 'register:' + req.ip,
    message: 'יותר מדי הרשמות מאותה כתובת. נסו שוב מאוחר יותר.',
})

// השראות AI: עד 10 בקשות ביום לכל משתמש (כל קריאה ל-Gemini עולה כסף).
// רץ אחרי verifyJWT, לכן יש req.user
const aiLimiter = makeRateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
    key: (req) => 'ai:' + (req.user?._id || req.ip),
    message: 'הגעתם למכסת הרעיונות היומית (10). נסו שוב מחר.',
})

module.exports = { makeRateLimit, loginLimiter, registerLimiter, aiLimiter }
