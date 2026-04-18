const express = require('express');
const router = express.Router();
const handleLogin = require('../middleware/handleLogin');
const Authorization = require('../middleware/authorization');
const {
    registerUser,
    verifyOTP,
    resendOTP,
    getCurrentUser,
    updateUserProfile,
} = require('../controllers/user.controller');
const { refreshToken, logout } = require('../controllers/auth.controller');

// Public routes
router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', handleLogin);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', Authorization, getCurrentUser);
router.put('/profile', Authorization, updateUserProfile);
router.post('/logout', Authorization, logout);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'User routes are working' });
});

module.exports = router;
