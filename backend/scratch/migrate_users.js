const { authPool } = require('../src/config/db');

async function migrate() {
    try {
        console.log('Adding is_verified column to users table...');
        await authPool.query('ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0 AFTER password');
        console.log('Successfully added is_verified column.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column is_verified already exists.');
            process.exit(0);
        }
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
