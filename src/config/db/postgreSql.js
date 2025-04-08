import pkg from 'pg';
import logger from "../logger.js";
import dotenv from 'dotenv';

dotenv.config();  

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    max: 70,  
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000,  
    ssl: { rejectUnauthorized: false }
});

export const checkSqlDatabaseHealth = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1'); 
        client.release(); 
        logger.info('Database health check successful!');
        return { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
        logger.error('Database health check failed:', error.message);
        return { status: 'unhealthy', message: `Database connection failed: ${error.message}` };
    }
};

export const checkDatabaseConnection = async () => {
    try {
        const client = await pool.connect();
        logger.info('Database connection successful!');
        client.release(); 
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

export default pool;
