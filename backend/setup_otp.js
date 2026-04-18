const { authPool } = require('./src/config/db');

async function setupOTPTable() {
    try {
        console.log('--- Initializing OTP Table ---');
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS otp_verifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                otp VARCHAR(10) NOT NULL,
                type ENUM('registration', 'login') NOT NULL,
                registration_data JSON DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME NOT NULL,
                INDEX idx_email (email),
                INDEX idx_expires (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        
        await authPool.query(createTableQuery);
        console.log('✅ otp_verifications table ensured.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating OTP table:', error);
        process.exit(1);
    }
}

setupOTPTable();
