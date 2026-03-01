const jwt = require('jsonwebtoken');
const pool = require("../config/db");

const fetchUser = async (req, res, next) => {
  try {
    // Extract token from cookie
    const token = req.cookies.Authorization;
    if (!token) {
      console.warn('No token in cookies', { ip: req.ip });
      return res.status(401).json({ error: 'No authorization token' });
    }

    // Decode/verify
    let decoded;
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      console.warn('Invalid JWT', { error: jwtErr.message, ip: req.ip });
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Extract userId
    const userId = decoded.userId || decoded.user_id || decoded.id;
    if (!userId) {
      console.error('No user ID in token payload', { payload: decoded, ip: req.ip });
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    // Query DB for fresh user data
    const [rows] = await pool.query(
      'SELECT user_id, username, email, contact_number, created_at FROM user WHERE user_id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      console.warn('User not found in DB', { userId, ip: req.ip });
      return res.status(404).json({ error: 'User not found' });
    }

    const userFromDb = rows[0];
    if (decoded.version && decoded.version !== userFromDb.version) {
      console.warn('Token revoked', { userId, ip: req.ip });
      return res.status(401).json({ error: 'Token revoked' });
    }

    // Merge token data + DB data into req.user
    req.user = { ...decoded, ...userFromDb };

    console.debug('User fetched successfully', { userId });
    next();
  } catch (error) {
    console.error('fetchUser error', { error: error.message, ip: req.ip });
  }
};

module.exports = fetchUser;