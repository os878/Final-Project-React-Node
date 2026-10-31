const jwt = require('jsonwebtoken')
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token is required' })
    }
    const token = authHeader.slice(7).trim()
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' })
    }
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err || !decoded?._id) {
                return res.status(401).json({ message: 'Invalid or expired authentication token' })
            }
            req.user = decoded
            next()
        }
    )
}
// בדיקת הרשאות לפי תפקיד
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user?.role) return res.status(401).json({ message: 'Unauthorized' })
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
        }
        next()
    }
}
module.exports = {verifyJWT, verifyRole}