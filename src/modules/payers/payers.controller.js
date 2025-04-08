import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../config/db/postgreSql.js';
import { Payer } from '../../models/payer.js';
import { User } from '../../models/user.js'

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

export const payerSignup = async (req, res) => {
    const { name, password, address, email, phone } = req.body;

    if (!name || !password || !address || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const payerRepository = AppDataSource.getRepository(Payer);
        const userRepository = AppDataSource.getRepository(User)

        const existingPayer = await payerRepository.findOne({ where: { email } });

        if (existingPayer) {
            return res.status(400).json({ message: 'Payer already exists. Please login instead.' });
        }

        const existingUser = await userRepository.findOne({where: {email}})

        if (existingUser) {
            return res.status(400).json({ message: 'User cannnot be a payer' });
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
        console.error('Error in payer signup:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const payerSignin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const payerRepository = AppDataSource.getRepository(Payer);

        const payer = await payerRepository.findOne({ where: { email } });

        if (!payer) {
            return res.status(404).json({ message: 'Payer not found. Please register first.' });
        }

        const isMatch = await bcrypt.compare(password, payer.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: payer.id, email: payer.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

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
        console.error('Error in payer signin:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
