import express from 'express'
import { getInsuranceById, getAllInsurances, createInsurance } from './insurance.controller.js'
import { verifyToken } from '../../utils/middleware.js'

const router = express.Router()

router.get('/', verifyToken, getAllInsurances)
router.get('/:insuranceId', verifyToken, getInsuranceById)
router.post('/', verifyToken, createInsurance)

export default router;