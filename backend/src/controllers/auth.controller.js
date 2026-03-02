const jwt = require('jsonwebtoken');
const { authPool: pool } = require('../config/db');
const { sendResponse } = require('../utils/response');

const refreshToken = async (req, res) => {
    try {
        const refresh_token = req.cookies?.refresh_token;

        if (!refresh_token) {
            return sendResponse(res, 401, false, 'Refresh token required');
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(
                refresh_token,
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
            );
        } catch (err) {
            return sendResponse(res, 403, false, 'Invalid or expired refresh token');
        }

        // Issue new access token
        const newAccessToken = jwt.sign(
            { user_id: decoded.user_id, username: decoded.username, email: decoded.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Set the new access token cookie
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        return sendResponse(res, 200, true, 'Token refreshed successfully');
    } catch (error) {
        console.error('Refresh token error:', error);
        return sendResponse(res, 500, false, 'Internal server error');
    }
};

const logout = async (req, res) => {
    try {
        // Clear cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);

        return sendResponse(res, 200, true, 'Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        return sendResponse(res, 500, false, 'Internal server error');
    }
};

module.exports = {
    refreshToken,
    logout,
};
