const { orderPool: pool, productPool } = require('../config/db');
const { sendResponse } = require('../utils/response');

// Generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD${timestamp}${random}`;
};

// Create new order
const createOrder = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return sendResponse(res, 401, false, 'User not authenticated');
        }

        const { items, itemTotal, deliveryFee, totalAmount, userData } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return sendResponse(res, 400, false, 'Order items are required');
        }

        if (!itemTotal || !totalAmount) {
            return sendResponse(res, 400, false, 'Order totals are required');
        }

        const orderNumber = generateOrderNumber();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Insert order
            const [orderResult] = await connection.query(
                `INSERT INTO orders 
         (user_id, order_number, item_total, delivery_fee, total_amount, status, 
          delivery_address, customer_name, customer_email, customer_contact, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, NOW(), NOW())`,
                [
                    userId,
                    orderNumber,
                    itemTotal,
                    deliveryFee || 0,
                    totalAmount,
                    userData?.address || '',
                    userData?.username || '',
                    userData?.email || '',
                    userData?.contact_number || '',
                ]
            );

            const orderId = orderResult.insertId;

            // Insert order items
            const itemPromises = items.map((item) => {
                const images = Array.isArray(item.images)
                    ? item.images
                    : item.images
                      ? [item.images]
                      : [];

                return connection.query(
                    `INSERT INTO order_items 
          (order_id, product_id, product_name, product_quantity, product_price, 
            cart_quantity, item_total, product_images)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        orderId,
                        item.id,
                        item.name,
                        item.quantity || '',
                        item.price,
                        item.cartQuantity || 1,
                        (parseFloat(item.price) || 0) * (item.cartQuantity || 1),
                        JSON.stringify(images),
                    ]
                );
            });

            await Promise.all(itemPromises);
            await connection.commit();

            // Fetch complete order with items
            const [orderRows] = await pool.query(
                `SELECT 
      o.*,
      CONCAT(
        '[', 
        GROUP_CONCAT(
          JSON_OBJECT(
            'item_id', oi.item_id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'product_quantity', oi.product_quantity,
            'product_price', oi.product_price,
            'cart_quantity', oi.cart_quantity,
            'item_total', oi.item_total,
            'product_images', oi.product_images
          )
        ),
        ']'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_id = ?
    GROUP BY o.order_id`,
                [orderId]
            );

            const order = orderRows[0];
            if (order.items) {
                try {
                    order.items = JSON.parse(order.items);
                } catch (e) {
                    order.items = [];
                }
            }

            return sendResponse(res, 201, true, 'Order placed successfully', order);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        next(error);
    }
};

// Get user's order history
const getOrderHistory = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return sendResponse(res, 401, false, 'User not authenticated');
        }

        const [orders] = await pool.query(
            `SELECT o.*, 
       (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) as item_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
            [userId]
        );

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items] = await pool.query(`SELECT * FROM order_items WHERE order_id = ?`, [
                    order.order_id,
                ]);

                const safeItems = items.map((item) => {
                    let images = [];
                    try {
                        if (item.product_images) {
                            const parsed = JSON.parse(item.product_images);
                            if (Array.isArray(parsed)) images = parsed;
                        }
                    } catch (err) {
                        images = [];
                    }

                    // return safe item
                    return {
                        ...item,
                        product_images: images,
                    };
                });

                return { ...order, items: safeItems };
            })
        );

        return sendResponse(res, 200, true, 'Order history fetched successfully', ordersWithItems);
    } catch (error) {
        console.error('Error fetching order history:', error);
        next(error);
    }
};

// Get order history by ID
const getOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.user_id;

        if (!orderId) {
            return sendResponse(res, 400, false, 'Order ID is required');
        }

        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized');
        }

        const [rows] = await pool.query(
            'SELECT order_id, order_number, item_total, delivery_fee, total_amount, status, created_at FROM orders WHERE order_id = ? AND user_id = ?',
            [orderId, userId]
        );

        if (rows.length === 0) {
            return sendResponse(res, 404, false, 'Order not found');
        }

        return sendResponse(res, 200, true, 'Order status fetched successfully', rows[0]);
    } catch (error) {
        console.error('Error fetching order status:', error);
        next(error);
    }
};

// Cancel order
const cancelOrder = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        const { orderId } = req.params;

        if (!userId) {
            return sendResponse(res, 401, false, 'User not authenticated');
        }

        // Check if order exists and belongs to user
        const [orderRows] = await pool.query(
            `SELECT * FROM orders WHERE order_id = ? AND user_id = ?`,
            [orderId, userId]
        );

        if (orderRows.length === 0) {
            return sendResponse(res, 404, false, 'Order not found');
        }

        const order = orderRows[0];

        // Check if order can be cancelled (not already cancelled or delivered)
        if (order.status === 'cancelled') {
            return sendResponse(res, 400, false, 'Order is already cancelled');
        }

        if (order.status === 'delivered') {
            return sendResponse(res, 400, false, 'Cannot cancel delivered order');
        }

        // Calculate cancellation
        const cancellationFee = 50;
        const refundAmount = order.total_amount - cancellationFee;

        // Update order status
        await pool.query(
            `UPDATE orders 
       SET status = 'cancelled', 
           cancellation_fee = ?,
           updated_at = NOW()
       WHERE order_id = ?`,
            [cancellationFee, orderId]
        );

        // Fetch updated order
        const [updatedOrderRows] = await pool.query(
            `SELECT o.*, 
       (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) as item_count
       FROM orders o
       WHERE o.order_id = ?`,
            [orderId]
        );

        const [items] = await pool.query(`SELECT * FROM order_items WHERE order_id = ?`, [orderId]);

        const updatedOrder = { ...updatedOrderRows[0], items, refundAmount };

        return sendResponse(
            res,
            200,
            true,
            `Order cancelled successfully. Cancellation fee: ₹${cancellationFee}. Refund amount: ₹${refundAmount}`,
            updatedOrder
        );
    } catch (error) {
        console.error('Error cancelling order:', error);
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrderHistory,
    cancelOrder,
    getOrderStatus,
};
