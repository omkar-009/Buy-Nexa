const { authPool: pool, otpPool } = require('../config/db');
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

        // Check if user is verified
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: 'Account not verified. Please complete registration by verifying your email.',
                email: user.email,
                verificationRequired: true,
                type: 'registration'
            });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate OTP for login
        const crypto = require('crypto');
        const { sendOTPMail } = require('../utils/mail');
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await otpPool.query(
            `INSERT INTO otp_verifications (email, otp, type, expires_at)
             VALUES (?, ?, ?, ?)`,
            [user.email, otp, 'login', expiresAt]
        );

        await sendOTPMail(user.email, otp);

        return res.status(200).json({
            success: true,
            message: 'Verification code sent to your email. Please check your inbox.',
            email: user.email,
            verificationRequired: true,
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

module.exports = handleLogin;
