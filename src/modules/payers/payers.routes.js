import express from 'express'
import { payerSignup, payerSignin } from './payers.controller.js'

const router = express.Router()

router.post('/signup', payerSignup)
router.post('/signin', payerSignin)

export default router;