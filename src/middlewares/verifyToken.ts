import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendFailureRes } from '../utils/formatResponse';
import { getuserById } from '../users/users.services';
import { catchAsync } from '../utils/catchAsync';
import { AUTH_TOKEN_COOKIE } from '../auth/auth.config';

export const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers['authorization'] || req.cookies[AUTH_TOKEN_COOKIE];
    if (!token) {
      return sendFailureRes(HttpStatus.UNAUTHORIZED)(res, 'Not authorized')({});
    }
    if (token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const id = decoded.id;
    const user = await getuserById(id);

    // @ts-expect-error password doesn't exist on req.decoded
    req.decoded = { ...user, password: undefined };

    return next();
  } catch (err) {
    return next(err);
  }
});
