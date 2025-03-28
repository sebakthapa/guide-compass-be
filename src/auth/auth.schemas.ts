import { z } from 'zod';
import { FE_CONTROLLED_USER_ROLES } from '../users/user.config';

export const SIGNUP_SCHEMA = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(16)
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      'Username must start with a letter and contain only letters, numbers, and underscores.'
    ),
  password: z
    .string()
    .min(6)
    .max(256)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/,
      'Password must include at least one letter, one number, and one symbol'
    ),
  role: z.enum(FE_CONTROLLED_USER_ROLES),
});

export const LOGIN_SCHEMA = z.object({
  identifier: z.string(),
  password: z.string(),
});

export const OPT_VERIFICATION_SCHEMA = z.object({
  otp: z.string().length(6, 'Invalid OTP'),
  token: z.string(),
});
