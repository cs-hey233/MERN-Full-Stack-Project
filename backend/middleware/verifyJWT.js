const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" })
    }
    const accessToken = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded.UserInfo.username
        req.roles = decoded.UserInfo.roles
        next()
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            res.status(401).json({ message: "Unauthorized: Access token expired" })
        } else if (err.name === "JsonWebTokenError") {
            res.status(401).json({ message: "Unauthorized: Invalid access token" })
        } else {
            res.status(401).json({ message: "Unauthorized: " + err.message })
        }
    }
}

module.exports = verifyJWT;