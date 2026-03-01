const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res, next) => {
  try {
    let { contact_no, email, identifier, password } = req.body;

    // Allow login via single identifier
    if (identifier) {
      identifier.includes("@")
        ? (email = identifier)
        : (contact_no = identifier);
    }

    if (!password || (!contact_no && !email)) {
      return res.status(400).json({
        success: false,
        message: "Email/Contact number and password are required",
      });
    }

    // Find user
    const query = contact_no
      ? "SELECT * FROM users WHERE contact_number = ?"
      : "SELECT * FROM users WHERE email = ?";

    const [rows] = await pool.query(query, [contact_no || email]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // JWT payload
    const payload = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    };

    // Create token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Remove old tokens (single-device login)
    await pool.query("DELETE FROM tokens WHERE user_id = ?", [user.user_id]);

    // Store token in DB
    await pool.query(
      "INSERT INTO tokens (user_id, username, access_token, created_at) VALUES (?, ?, ?, NOW())",
      [user.user_id, user.username, accessToken]
    );

    // Set HTTP-only cookie
    res.cookie("Authorization", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }); 

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

module.exports = handleLogin;