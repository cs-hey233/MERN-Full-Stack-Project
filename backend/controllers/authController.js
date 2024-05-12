const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const user = await User.findOne({ username: req.body.username })

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (!user.active) {
        return res.status(400).json({ message: "User account not active" })
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" })
    }

    const accessToken = jwt.sign(
        {
            UserInfo: {
                username: user.username,
                roles: user.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    )

    const refreshToken = jwt.sign(
        {
            UserInfo: {
                username: user.username,
                roles:user.roles
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None' }) 
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None' })
    res.status(200).json({ message: "Login successful" })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public
// This endpoint is used when the client's access token has expired or
// when the client anticipates that the access token will expire soon.
// It requires a valid non-expired refresh token, which the client should send as a cookie.
// If the refresh token is valid, a new access token is issued to the client.
const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies
    
    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized: Missing refresh token" })
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne({ username: decoded.UserInfo.username })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const accessToken = jwt.sign(
            { UserInfo: { username: user.username, roles: user.roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        )
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None' })
        res.status(200).json({ message: "Access token updated" })
    } catch (err) {
        console.error(err)
        if (err.name === "TokenExpiredError") {
            res.status(401).json({ message: "Unauthorized: Refresh token expired" })
        } else {
            res.status(401).json({ message: "Unauthorized: Invalid refresh token" })
        }
    }
})

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = (req, res) => {
    if (req.cookies.refreshToken) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None' })
    }
    if (req.cookies.accessToken) {
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None' })
    }
    res.status(200).json({ message: "Logged out successfully" })
}

module.exports = {
    login,
    refresh,
    logout
}