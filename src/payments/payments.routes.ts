import { Router } from 'express';
import { paymentContEsewaPaymentSuccess } from './payments.controllers';
import { validateZodSchema } from '../middlewares/validateData';
import { ESEWA_SUCCESS_SCHEMA } from './payments.schemas';

const router = Router();

// GET /api/payments/esewa
router.post('/esewa', validateZodSchema(ESEWA_SUCCESS_SCHEMA), paymentContEsewaPaymentSuccess);

export default router;
