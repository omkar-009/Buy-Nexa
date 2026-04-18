const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { authPool: pool, otpPool } = require('../config/db');
const { sendResponse } = require('../utils/response');
const { sendOTPMail } = require('../utils/mail');

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Get current user profile
const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;

        if (!userId) {
            return sendResponse(res, 401, false, 'User not authenticated');
        }

        // Check if contact_number column exists, if not use contact_no
        let contactColumn = 'contact_number';
        try {
            const [colCheck] = await pool.query(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'contact_number'"
            );
            if (colCheck.length === 0) {
                // Check if contact_no exists instead
                const [colCheck2] = await pool.query(
                    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'contact_no'"
                );
                if (colCheck2.length > 0) {
                    contactColumn = 'contact_no';
                } else {
                    // Neither exists, add contact_number
                    await pool.query('ALTER TABLE users ADD COLUMN contact_number VARCHAR(15)');
                }
            }
        } catch (e) {
            console.log('Column check error:', e.message);
        }

        // Fetch user from database
        const [rows] = await pool.query(
            `SELECT user_id, username, email, ${contactColumn} as contact_number, address FROM users WHERE user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return sendResponse(res, 404, false, 'User not found');
        }

        if (rows.length === 0) {
            return sendResponse(res, 404, false, 'User not found');
        }

        const user = rows[0];
        // Remove sensitive data
        delete user.password_hash;
        delete user.password;

        return sendResponse(res, 200, true, 'User fetched successfully', user);
    } catch (error) {
        next(error);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { username, email, contact_no, password } = req.body;

        // Validation
        if (!username || !email || !password || !contact_no) {
            return sendResponse(res, 400, false, 'Please provide all required fields');
        }

        // Check if email already exists
        const [emailRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (emailRows.length > 0) {
            return sendResponse(res, 409, false, 'User with this email already exists');
        }

        // Check if contact number already exists
        const [contactRows] = await pool.query('SELECT * FROM users WHERE contact_number = ?', [
            contact_no,
        ]);
        if (contactRows.length > 0) {
            return sendResponse(res, 409, false, 'User with this contact number already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Store registration data and OTP
        await otpPool.query(
            `INSERT INTO otp_verifications (email, otp, type, registration_data, expires_at)
             VALUES (?, ?, ?, ?, ?)`,
            [
                email.trim(),
                otp,
                'registration',
                JSON.stringify({ 
                    username: username.trim(), 
                    email: email.trim(), 
                    contact_no: contact_no.trim(), 
                    password_hash: hashedPassword,
                    password: password
                }),
                expiresAt,
            ]
        );

        // Send OTP mail
        await sendOTPMail(email.trim(), otp);

        // Success response
        return sendResponse(res, 200, true, 'OTP sent to your email for verification', {
            email: email.trim(),
            verificationRequired: true
        });
    } catch (error) {
        next(error);
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp, type } = req.body;

        if (!email || !otp || !type) {
            return sendResponse(res, 400, false, 'Email, OTP, and type are required');
        }

        // Check OTP
        const [rows] = await otpPool.query(
            `SELECT * FROM otp_verifications 
             WHERE email = ? AND otp = ? AND type = ? AND expires_at > NOW()
             ORDER BY created_at DESC LIMIT 1`,
            [email, otp, type]
        );

        if (rows.length === 0) {
            return sendResponse(res, 401, false, 'Invalid or expired OTP');
        }

        const otpRecord = rows[0];

        if (type === 'registration') {
            const userData = JSON.parse(otpRecord.registration_data);

            // Double check email/contact didn't get registered in the meantime
            const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [userData.email]);
            if (existing.length > 0) return sendResponse(res, 409, false, 'User already registered');

            // Insert user
            const [result] = await pool.query(
                `INSERT INTO users 
                    (username, email, contact_number, password_hash, password, created_at)
                    VALUES (?, ?, ?, ?, ?, NOW())`,
                [userData.username, userData.email, userData.contact_no, userData.password_hash, userData.password]
            );

            // Clean up OTP
            await otpPool.query('DELETE FROM otp_verifications WHERE email = ?', [email]);

            return sendResponse(res, 201, true, 'User registered successfully', {
                userId: result.insertId,
                username: userData.username,
                email: userData.email,
            });
        } else if (type === 'login') {
            // For login, the tokens are usually issued here. 
            // We need to fetch the user details to create a token.
            const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (userRows.length === 0) return sendResponse(res, 404, false, 'User not found');
            
            const user = userRows[0];
            const jwt = require('jsonwebtoken'); // Require locally or move to top if possible
            
            const payload = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            };

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '15d' });

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            };

            res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
            res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 15 * 24 * 60 * 60 * 1000 });

            // Clean up OTP
            await otpPool.query('DELETE FROM otp_verifications WHERE email = ?', [email]);

            return sendResponse(res, 200, true, 'Login successful', {
                user: { user_id: user.user_id, username: user.username, email: user.email }
            });
        }

        return sendResponse(res, 400, false, 'Invalid verification type');
    } catch (error) {
        next(error);
    }
};

const resendOTP = async (req, res, next) => {
    try {
        const { email, type } = req.body;

        if (!email || !type) {
            return sendResponse(res, 400, false, 'Email and type are required');
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Update or Insert OTP
        await otpPool.query(
            `INSERT INTO otp_verifications (email, otp, type, expires_at)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at), created_at = NOW()`,
            [email, otp, type, expiresAt]
        );

        await sendOTPMail(email, otp);

        return sendResponse(res, 200, true, 'New OTP sent to your email');
    } catch (error) {
        next(error);
    }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        const { username, email, contact_number, address } = req.body;

        if (!userId) {
            return sendResponse(res, 401, false, 'User not authenticated');
        }

        // Validate required fields
        if (!username || !email || !contact_number) {
            return sendResponse(
                res,
                400,
                false,
                'Username, email, and contact number are required'
            );
        }

        // Check if email is already taken by another user
        const [emailRows] = await pool.query(
            'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
            [email, userId]
        );
        if (emailRows.length > 0) {
            return sendResponse(res, 409, false, 'Email already in use by another account');
        }

        // Check if contact number is already taken by another user
        const [contactRows] = await pool.query(
            'SELECT user_id FROM users WHERE contact_number = ? AND user_id != ?',
            [contact_number, userId]
        );
        if (contactRows.length > 0) {
            return sendResponse(
                res,
                409,
                false,
                'Contact number already in use by another account'
            );
        }

        // Update user profile
        await pool.query(
            `UPDATE users 
       SET username = ?, email = ?, contact_number = ?, address = ?
       WHERE user_id = ?`,
            [username.trim(), email.trim(), contact_number.trim(), address?.trim() || null, userId]
        );

        // Fetch updated user
        const [updatedRows] = await pool.query(
            'SELECT user_id, username, email, contact_number, address FROM users WHERE user_id = ?',
            [userId]
        );

        if (updatedRows.length === 0) {
            return sendResponse(res, 404, false, 'User not found');
        }

        const updatedUser = updatedRows[0];
        delete updatedUser.password_hash;
        delete updatedUser.password;

        return sendResponse(res, 200, true, 'Profile updated successfully', updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        next(error);
    }
};

module.exports = {
    registerUser,
    getCurrentUser,
    updateUserProfile,
    verifyOTP,
    resendOTP,
};
