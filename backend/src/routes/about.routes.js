const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/authorization");
const { sendFeedback } = require("../controllers/about.controller");

router.post("/feedback", Authorization, sendFeedback);

module.exports = router;