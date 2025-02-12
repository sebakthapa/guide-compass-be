import { Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../env';
import { AUTH_TOKEN_COOKIE } from '../auth/auth.config';

// eslint-disable-next-line @typescript-eslint/ban-types
export const generateToken = (res: Response, data: {}) => {
  const token = jwt.sign(data, env.JWT_SECRET || '', {
    expiresIn: env.TOKEN_EXPIRES,
  });
  res.cookie(AUTH_TOKEN_COOKIE, token, {
    maxAge: 86400000, // 24 hrs
    secure: false, // if SSL is implemented than true
    httpOnly: true,
  });

  return token;
};
