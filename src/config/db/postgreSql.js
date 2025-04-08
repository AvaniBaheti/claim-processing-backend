import { DataSource } from 'typeorm';
import { User } from '../../models/user.js';
import { Payer } from '../../models/payer.js';
import { Insurance } from '../../models/insurance.js';
import { Claim } from '../../models/claim.js';
import logger from "../logger.js";
import dotenv from 'dotenv';

dotenv.config();

let AppDataSource;

if (!AppDataSource) {
    AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true, 
        logging: true,
        entities: [User, Payer, Insurance, Claim],
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
}

export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            logger.info('Database connected successfully.');
        } else {
            logger.info('Database already initialized.');
        }
    } catch (error) {
        logger.error('Database connection failed:', error.message);
        process.exit(1); 
    }
};

export const checkSqlDatabaseHealth = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const result = await AppDataSource.query('SELECT 1');
        logger.info('Database health check successful!');
        return { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
        logger.error('Database health check failed:', error.message);
        return { status: 'unhealthy', message: `Database connection failed: ${error.message}` };
    }
};

export default AppDataSource;
