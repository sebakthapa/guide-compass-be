import * as schemas from '../auth/auth.schemas';

export type SignupRequestBody = Zod.infer<typeof schemas.SIGNUP_SCHEMA>;
export type VerifyOtpRequestBody = Zod.infer<typeof schemas.OPT_VERIFICATION_SCHEMA>;
export type LoginRequestBody = Zod.infer<typeof schemas.LOGIN_SCHEMA>;
