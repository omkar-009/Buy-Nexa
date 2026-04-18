const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

const sendMail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: '"Buy Nexa" <no-reply@buynexa.com>',
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

const sendOTPMail = async (email, otp) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="text-align: center; color: #000;">BUY NEXA</h2>
            <p>Hello,</p>
            <p>Your verification code for Buy Nexa is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${otp}</span>
            </div>
            <p>This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Buy Nexa Inc. All rights reserved.</p>
        </div>
    `;
    return sendMail({ to: email, subject: 'Buy Nexa - Verification Code', html });
};

const sendOrderConfirmationMail = async (email, order) => {
    const trackingLink = `http://localhost:5173/order/${order.order_id}`;
    
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name} x ${item.cart_quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.item_total}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="text-align: center; color: #000;">ORDER CONFIRMED</h2>
            <p>Thank you for your order, <strong>${order.customer_name}</strong>!</p>
            <p>Order Number: <strong>${order.order_number}</strong></p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background: #f9f9f9;">
                        <th style="padding: 10px; text-align: left;">Item</th>
                        <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Total</td>
                        <td style="padding: 10px; font-weight: bold; text-align: right;">₹${order.total_amount}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${trackingLink}" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">TRACK ORDER</a>
            </div>

            <p>Delivery Address: ${order.delivery_address}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Buy Nexa Inc. All rights reserved.</p>
        </div>
    `;
    return sendMail({ to: email, subject: `Order Confirmed - ${order.order_number}`, html });
};

module.exports = {
    sendOTPMail,
    sendOrderConfirmationMail,
};
