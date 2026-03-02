const { authPool: pool } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res, next) => {
    try {
        let { contact_no, email, identifier, password } = req.body;

        if (identifier) {
            identifier.includes('@') ? (email = identifier) : (contact_no = identifier);
        }

        if (!password || (!contact_no && !email)) {
            return res.status(400).json({
                success: false,
                message: 'Email/Contact number and password are required',
            });
        }

        const query = contact_no
            ? 'SELECT * FROM users WHERE contact_number = ?'
            : 'SELECT * FROM users WHERE email = ?';

        const [rows] = await pool.query(query, [contact_no || email]);

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const user = rows[0];

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const payload = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        };

        // Create tokens
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            {
                expiresIn: '15d',
            }
        );

        // Set Cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.cookie('access_token', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', refreshToken, {
            ...cookieOptions,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

module.exports = handleLogin;
