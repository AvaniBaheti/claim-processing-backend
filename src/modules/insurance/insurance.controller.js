import AppDataSource from '../../config/db/postgreSql.js';
import { Insurance } from '../../models/insurance.js';
import { Payer } from '../../models/payer.js';
import logger from '../../config/logger.js'; 

export const createInsurance = async (req, res) => {
    const { name, policy_number, coverage_details, maximum_amount } = req.body;

    if (!name || !policy_number || !coverage_details || !maximum_amount) {
        logger.warn('Missing required fields during insurance creation', { fields: req.body });
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const payerRepository = AppDataSource.getRepository(Payer);
        const payer = await payerRepository.findOne({ where: { id: req.user.id } });

        if (!payer) {
            logger.error('Only Payers can create insurance. Unauthorized access attempt', { userId: req.user.id });
            return res.status(403).json({ message: 'Only Payers can create insurance.' });
        }

        const insuranceRepository = AppDataSource.getRepository(Insurance);

        const newInsurance = insuranceRepository.create({
            name,
            policy_number,
            coverage_details,
            payer: { id: req.user.id },
            maximum_amount,
            created_at: new Date(),
            updated_at: new Date()
        });

        const result = await insuranceRepository.save(newInsurance);

        res.status(201).json({
            message: 'Insurance created successfully.',
            insurance: result
        });

    } catch (error) {
        logger.error('Error in creating insurance:', { error: error.message, userId: req.user.id });
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getInsuranceById = async (req, res) => {
    const { insuranceId } = req.params;

    try {
        const insuranceRepository = AppDataSource.getRepository(Insurance);

        const insurance = await insuranceRepository.findOne({
            where: { id: insuranceId },
            relations: ['payer', 'user']
        });

        if (!insurance) {
            logger.warn('Insurance not found or access denied', { insuranceId, userId: req.user.id });
            return res.status(404).json({ message: 'Insurance not found or you do not have access to it.' });
        }

        res.status(200).json({ insurance });

    } catch (error) {
        logger.error('Error in fetching insurance by ID:', { error: error.message, insuranceId });
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getAllInsurances = async (req, res) => {
    try {
        const insuranceRepository = AppDataSource.getRepository(Insurance);

        const insurances = await insuranceRepository.find({
            relations: ['payer', 'user']
        });

        res.status(200).json({ insurances });
    } catch (error) {
        logger.error('Error in fetching insurances:', { error: error.message });
        res.status(500).json({ message: 'Internal server error.' });
    }
};
