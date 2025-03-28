import { Router } from 'express';
import * as schemas from './auth.schemas';
import * as cont from './auth.controllers';
import * as validators from './auth.validators';
import { validateZodSchema } from '../middlewares/validateData';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// POST /api/auth/sigup
router.post(
  '/signup',
  validateZodSchema(schemas.SIGNUP_SCHEMA),
  validators.validateDuplicateDataForSignup,
  cont.authContValidateSignpRequest
);

// POST /signup/verify-otp
router.post(
  '/signup/verify-otp',
  validateZodSchema(schemas.OPT_VERIFICATION_SCHEMA),
  validators.validateDuplicateDataForSignupOtpVerification,
  cont.authContVerifysignUpOtp
);

// POST /api/login
router.post('/login', validateZodSchema(schemas.LOGIN_SCHEMA), cont.authContLogin);

// GET /api/login
router.get('/session', verifyToken, cont.authContGetSession);

// GET /api/logout
router.get('/logout', cont.authContLogout);

router.get(
  '/signup/resend-otp',
  validateZodSchema(schemas.RESEND_OTP_SCHEMA),
  validators.validateResendSignupOtp,
  cont.authContResendSignupOtp
);

router.get(
  '/reset-password/otp',
  validateZodSchema(schemas.RESET_PASSWORD_OTP_SCHEMA),
  validators.validateResetPasswordInitiate,
  cont.authContSendResetPasswordOtp
);
router.patch('/reset-password', validateZodSchema(schemas.RESET_PASSWORD_SCHEMA), cont.authContResetPassword);

export default router;
