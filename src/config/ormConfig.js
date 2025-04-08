import { DataSource } from 'typeorm';
import { User } from '../models/user.js';
import { Payer } from '../models/payer.js';
import { Insurance } from '../models/insurance.js';
import { Claim } from '../models/claim.js';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
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
