const pool = require("../config/db");
const { sendResponse } = require("../utils/response");

const sendFeedback = async (req, res) => {
  try {
    let { userNm, email, contact_no, msg } = req.body;
    const userId = req.user?.user_id || null;
    
    userNm = userNm?.trim();
    msg = msg?.trim();
    email = email?.toLowerCase();

    // Username validation
    if (!userNm) {
      return sendResponse(res, 400, false, "Username is required");
    }
    if (userNm.length < 2) {
      return sendResponse(res, 400, false, "Username must be at least 2 characters");
    }

    // Email validation
    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(res, 400, false, "Invalid email format");
    }

    // Contact number validation
    if (!contact_no) {
      return sendResponse(res, 400, false, "Contact number is required");
    }
    if (!/^\d{10}$/.test(contact_no)) {
      return sendResponse(res, 400, false, "Contact number must be 10 digits");
    }

    // Message validation
    if (!msg) {
      return sendResponse(res, 400, false, "Message is required");
    }
    if (msg.length < 10) {
      return sendResponse(res, 400, false, "Message must be at least 10 characters");
    }

    await pool.query(
      `INSERT INTO user_feedback 
       (user_id, username, email, contact_no, msg)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, userNm, email, contact_no, msg]
    );

    return sendResponse(res, 201, true, "Feedback submitted successfully");

  } catch (error) {
    console.error("Send feedback error:", error);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = { sendFeedback };
