const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/authorization");
const { createOrder, getOrderHistory, cancelOrder, getOrderStatus } = require("../controllers/order.controller");

// All order routes require authentication
router.use(Authorization);

// Create new order
router.post("/place", createOrder);

// Get user's order history
router.get("/history", getOrderHistory);

// Cancel order
router.put("/:orderId/cancel", cancelOrder);

// Get order history by ID
router.get("/:orderId", Authorization, getOrderStatus)

module.exports = router;
