import express from 'express'
import { createClaim, getClaims, getClaimById , getClaimStatus, updateClaimStatus } from './claim.controller.js'
import { verifyToken } from '../../utils/middleware.js'

const router = express.Router()

router.post('/', verifyToken, createClaim)
router.get('/', verifyToken, getClaims)
router.get('/:id', verifyToken, getClaimById)
router.get('/status/:id', verifyToken,getClaimStatus )
router.patch('/:claimId', verifyToken, updateClaimStatus)

export default router;