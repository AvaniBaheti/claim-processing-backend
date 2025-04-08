import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../config/db/postgreSql.js';
import { User } from '../../models/user.js';
import logger from '../../config/logger.js'; 

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        logger.warn('Missing required fields during signup', { name, email });
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { email } });

        if (existingUser) {
            logger.warn('User already exists', { email });
            return res.status(400).json({ message: 'User already exists. Please login instead.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        });

        const result = await userRepository.save(newUser);

        const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        logger.info('User registered successfully', { userId: result.id, email: result.email });

        res.status(201).json({
            message: 'User registered successfully.',
            token,
            user: {
                id: result.id,
                name: result.name,
                email: result.email
            }
        });

    } catch (error) {
        logger.error('Error in signup:', { error: error.message });
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn('Missing email or password during signin attempt', { email });
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            logger.warn('User not found during signin attempt', { email });
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.warn('Invalid credentials during signin', { email });
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        logger.info('User logged in successfully', { userId: user.id, email: user.email });

        res.status(200).json({
            message: 'User logged in successfully.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        logger.error('Error in signin:', { error: error.message });
        res.status(500).json({ message: 'Internal server error.' });
    }
};
