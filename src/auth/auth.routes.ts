import { Router } from 'express';
import * as schemas from './auth.schemas';
import * as cont from './auth.controllers';
import * as validators from './auth.validators';
import { validateData } from '../middlewares/validateData';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// POST /api/auth/sigup
router.post(
  '/signup',
  validateData(schemas.SIGNUP_SCHEMA),
  validators.validateDuplicateDataForSignup,
  cont.authContValidateSignpRequest
);

// POST /signup/verify-otp
router.post(
  '/signup/verify-otp',
  validateData(schemas.OPT_VERIFICATION_SCHEMA),
  validators.validateDuplicateDataForSignupOtpVerification,
  cont.authContVerifyOtp
);

// POST /api/login
router.post('/login', validateData(schemas.LOGIN_SCHEMA), cont.authContLogin);

// GET /api/login
router.get('/session', verifyToken, cont.authContGetSession);

export default router;
