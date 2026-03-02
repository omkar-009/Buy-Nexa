const jwt = require('jsonwebtoken');
const { authPool: pool } = require('../config/db');

const Authorization = async (req, res, next) => {
    try {
        let token;

        // Read token from HTTP-only COOKIE
        if (req.cookies?.Authorization) {
            token = req.cookies.Authorization;
        }

        // Fallback: Read token from Authorization header
        else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // No token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
            });
        }

        // Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            res.clearCookie('Authorization', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });

            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        // Check token in DB (revocation check)
        const [rows] = await pool.query(
            'SELECT token_id FROM tokens WHERE access_token = ? AND user_id = ?',
            [token, decoded.user_id]
        );

        if (!rows.length) {
            res.clearCookie('Authorization', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });

            return res.status(401).json({
                success: false,
                message: 'Token revoked. Please login again',
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
