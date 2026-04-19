const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    logger: true,
    debug: true,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

// Verify credentials
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Credentials WRONG:', error);
    } else {
        console.log('✅ Server is ready to send emails');
    }
});
