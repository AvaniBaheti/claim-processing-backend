import express from 'express'
import { getInsuranceById, getAllInsurances, createInsurance } from './insurance.controller.js'
import { verifyToken } from '../../utils/middleware.js'

const router = express.Router()

router.get('/', getAllInsurances)
router.get('/:insuranceId', getInsuranceById)
router.post('/', verifyToken, createInsurance)

export default router;