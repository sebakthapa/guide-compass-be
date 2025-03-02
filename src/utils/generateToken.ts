import { Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../env';
import { AUTH_TOKEN_COOKIE_NAME } from '../auth/auth.config';
import ms from 'ms';

// eslint-disable-next-line @typescript-eslint/ban-types
export const generateToken = (res: Response, data: {}) => {
  const token = jwt.sign(data, env.JWT_SECRET || '', {
    expiresIn: +env.TOKEN_EXPIRES,
  });

  res.cookie(AUTH_TOKEN_COOKIE_NAME, token, {
    maxAge: ms('7d'), // 24 hrs
    secure: false, // if SSL is implemented than true
    httpOnly: true,
  });

  return token;
};
