const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Create connection pools for each microservice
const authPool = mysql.createPool({ ...dbConfig, database: 'auth_db' });
const orderPool = mysql.createPool({ ...dbConfig, database: 'order_db' });
const cartPool = mysql.createPool({ ...dbConfig, database: 'cart_db' });
const productPool = mysql.createPool({ ...dbConfig, database: 'vcoop' });

// Test connections
const testConnection = async (pool, name) => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ ${name} Database connected successfully!`);
        connection.release();
    } catch (error) {
        console.error(`❌ ${name} Database connection failed:`, error.message);
    }
};

(async () => {
    await testConnection(authPool, 'Auth');
    await testConnection(orderPool, 'Order');
    await testConnection(cartPool, 'Cart');
    await testConnection(productPool, 'Product');
})();

module.exports = {
    authPool,
    orderPool,
    cartPool,
    productPool,
};
