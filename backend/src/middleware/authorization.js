const jwt = require('jsonwebtoken');
const { authPool: pool } = require('../config/db');

const Authorization = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No access token provided',
            });
        }

        // Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid or expired access token',
                code: 'TOKEN_EXPIRED',
            });
        }

        // Attach user to request
        req.user = {
            user_id: decoded.user_id,
            email: decoded.email,
            username: decoded.username,
        };

        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = Authorization;
