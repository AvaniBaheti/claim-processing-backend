import AppDataSource from '../../config/db/postgreSql.js';
import { Insurance } from '../../models/insurance.js';
import { Payer } from '../../models/payer.js';

export const createInsurance = async (req, res) => {
    const { name, policy_number, coverage_details, maximum_amount } = req.body;

    if (!name || !policy_number || !coverage_details || !maximum_amount) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const payerRepository = AppDataSource.getRepository(Payer);
        const payer = await payerRepository.findOne({ where: { id: req.user.id } });

        if (!payer) {
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
        console.error('Error in creating insurance:', error.message);
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
            return res.status(404).json({ message: 'Insurance not found or you do not have access to it.' });
        }

        res.status(200).json({ insurance });

    } catch (error) {
        console.error('Error in fetching insurance by ID:', error.message);
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
        console.error('Error in fetching insurances:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
