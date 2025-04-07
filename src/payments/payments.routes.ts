import { Router } from 'express';
import { paymentContEsewaPaymentSuccess } from './payments.controllers';

const router = Router();

// GET /api/payments/esewa
router.post('/esewa', paymentContEsewaPaymentSuccess);

export default router;
