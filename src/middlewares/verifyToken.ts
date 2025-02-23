import { Request, Response, NextFunction } from 'express';
import HttpStatus, { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendFailureRes } from '../utils/formatResponse';
import { catchAsync } from '../utils/catchAsync';
import { getUserById } from '../users/users.services';
import { AUTH_TOKEN_COOKIE_NAME } from '../auth/auth.config';

export const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers['authorization'] || req.cookies[AUTH_TOKEN_COOKIE_NAME];
    if (!token) {
      return sendFailureRes(HttpStatus.UNAUTHORIZED)(res, 'Not authorized')({});
    }
    if (token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const id = decoded.id;
    const user = await getUserById(id);

    // @ts-expect-error password doesn't exist on req.decoded
    req.decoded = { ...user, password: undefined };

    return next();
  } catch (err) {
    return next(err);
  }
});

export const authorizeUser = catchAsync((req: Request, res: Response, next: NextFunction) => {
  const id = req.decoded?.id;

  if (!id) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'You must be logged in to continue')({});
  }

  return next();
});
