import AppDataSource from '../../config/db/postgreSql.js';
import { Claim } from '../../models/claim.js';
import { Insurance } from '../../models/insurance.js';
import { Payer } from '../../models/payer.js';
import { User } from '../../models/user.js';

export const createClaim = async (req, res) => {
    const { amount, procedure_code } = req.body;

    if (!amount || !procedure_code) {
        return res.status(400).json({ message: 'Insurance ID, amount, and procedure code are required.' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please login first.' });
        }

        const insuranceRepository = AppDataSource.getRepository(Insurance);
        const insurance = await insuranceRepository.findOne({ where: {policy_number: procedure_code} });

        if (!insurance) {
            return res.status(404).json({ message: 'Insurance not found.' });
        }

        if (amount > insurance.maximum_amount) {
            return res.status(400).json({ message: `Claim amount exceeds the maximum allowed amount of ${insurance.maximum_amount}.` });
        }

        const claimRepository = AppDataSource.getRepository(Claim);
        const newClaim = claimRepository.create({
            insurance_id: insurance.id,
            amount,
            procedure_code,
            user: { id: req.user.id }, 
            created_at: new Date(),
            updated_at: new Date()
        });

        const result = await claimRepository.save(newClaim);

        res.status(201).json({
            message: 'Claim created successfully.',
            claim: result
        });

    } catch (error) {
        console.error('Error in creating claim:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const getClaims = async (req, res) => {
    try {
        const claimRepository = AppDataSource.getRepository(Claim);

        const claims = await claimRepository.find({
            where: [
                { user: { id: req.user.id } },  
                { insurance: { payer: { id: req.user.id } } }  
            ],
            relations: ['insurance', 'insurance.payer']  
        });

        res.status(200).json({ claims });
    } catch (error) {
        console.error('Error in fetching claims:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const getClaimById = async (req, res) => {
    const { id } = req.params;

    try {
        const claimRepository = AppDataSource.getRepository(Claim);

        const claim = await claimRepository.findOne({
            where: [
                {id: id},
                { user: { id: req.user.id } },  
                { insurance: { payer: { id: req.user.id } } }  
            ],
            relations: ['insurance', 'insurance.payer', 'user']  
        });

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found or you do not have access to it.' });
        }

        if (claim.user.id !== req.user.id && claim.insurance.payer.id !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to access this claim.' });
        }

        res.status(200).json({ claim });
    } catch (error) {
        console.error('Error in fetching claim by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



export const getClaimStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const claimRepository = AppDataSource.getRepository(Claim);

        const claim = await claimRepository.findOne({
            where: { id: id },
            relations: ['insurance', 'insurance.payer', 'user']  
        });

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found or you do not have access to it.' });
        }

        if (claim.user.id !== req.user.id && claim.insurance.payer.id !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to access this claim status.' });
        }

        res.status(200).json({ status: claim.status });
    } catch (error) {
        console.error('Error in fetching claim status:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const updateClaimStatus = async (req, res) => {
    const { claimId } = req.params;  
    const { status } = req.body;  

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    try {
        const claimRepository = AppDataSource.getRepository(Claim);

        const claim = await claimRepository.findOne({
            where: { id: claimId },
            relations: ['insurance', 'insurance.payer'] 
        });

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found.' });
        }

        const insurance = claim.insurance;
        const payer = insurance.payer;

        if (!insurance) {
            return res.status(404).json({ message: 'Associated insurance not found.' });
        }

        if (payer.id !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to update this claim.' });
        }

        claim.status = status;
        claim.updated_at = new Date();

        const updatedClaim = await claimRepository.save(claim);

        res.status(200).json({
            message: 'Claim status updated successfully.',
            claim: updatedClaim
        });

    } catch (error) {
        console.error('Error in updating claim status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



