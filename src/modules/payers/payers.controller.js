import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../config/db/postgreSql.js';
import { Payer } from '../../models/payer.js';
import { User } from '../../models/user.js';
import logger from '../../config/logger.js'; 

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

export const payerSignup = async (req, res) => {
    const { name, password, address, email, phone } = req.body;

    if (!name || !password || !address || !email || !phone) {
        logger.warn('Missing required fields during payer signup', { email });
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const payerRepository = AppDataSource.getRepository(Payer);
        const userRepository = AppDataSource.getRepository(User);

        const existingPayer = await payerRepository.findOne({ where: { email } });

        if (existingPayer) {
            logger.warn('Payer already exists', { email });
            return res.status(400).json({ message: 'Payer already exists. Please login instead.' });
        }

        const existingUser = await userRepository.findOne({ where: { email } });

        if (existingUser) {
            logger.warn('User cannot be a payer', { email });
            return res.status(400).json({ message: 'User cannot be a payer' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newPayer = payerRepository.create({
            name,
            password: hashedPassword,
            address,
            email,
            phone,
            created_at: new Date(),
            updated_at: new Date()
        });

        const result = await payerRepository.save(newPayer);

        const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        logger.info('Payer registered successfully', { payerId: result.id, email: result.email });

        res.status(201).json({
            message: 'Payer registered successfully.',
            token,
            payer: {
                id: result.id,
                name: result.name,
                email: result.email,
                phone: result.phone
            }
        });

    } catch (error) {
        logger.error('Error in payer signup:', { error: error.message });
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const payerSignin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn('Missing email or password during payer signin', { email });
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const payerRepository = AppDataSource.getRepository(Payer);

        const payer = await payerRepository
        .createQueryBuilder("payer")
        .addSelect("payer.password")
        .where("payer.email = :email", { email })
        .getOne();

        if (!payer) {
            logger.warn('Payer not found during signin attempt', { email });
            return res.status(404).json({ message: 'Payer not found. Please register first.' });
        }

        const isMatch = await bcrypt.compare(password, payer.password);

        if (!isMatch) {
            logger.warn('Invalid credentials during payer signin', { email });
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: payer.id, email: payer.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        logger.info('Payer logged in successfully', { payerId: payer.id, email: payer.email });

        res.status(200).json({
            message: 'Payer logged in successfully.',
            token,
            payer: {
                id: payer.id,
                name: payer.name,
                email: payer.email,
                phone: payer.phone
            }
        });

    } catch (error) {
        logger.error('Error in payer signin:', { error: error.message });
        res.status(500).json({ message: 'Internal server error.' });
    }
};
