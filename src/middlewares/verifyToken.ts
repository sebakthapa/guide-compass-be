import { Request, Response, NextFunction } from 'express';
import HttpStatus, { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendFailureRes } from '../utils/formatResponse';
import { catchAsync } from '../utils/catchAsync';
import { AUTH_TOKEN_COOKIE_NAME } from '../auth/auth.config';
import { UserRole } from '@prisma/client';
import prisma from '../db';

/**
 * Adds user data to request
 * returns error only incase of error
 */
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
    const userDetails = await prisma.user.findFirst({ where: { id }, include: { guide: { select: { id: true } } } });

    if (userDetails) {
      if (userDetails.isBanned) {
        return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'You are banned')({});
      }
    } else {
      return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'You are not authorized')({});
    }

    const { guide, password: _password, ...user } = userDetails;

    req.decoded = { ...user, guideId: guide?.id };

    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Authorizes the existence of user
 * returns 401 if doesn't exist
 */
export const authorizeUser = catchAsync((req: Request, res: Response, next: NextFunction) => {
  const id = req.decoded?.id;

  if (!id) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'You must be logged in to continue')({});
  }

  return next();
});

/**
 * Authorizes the existence of user
 * returns 401 if doesn't exist
 */
export const authorizeUserRole = (role: UserRole) =>
  catchAsync((req: Request, res: Response, next: NextFunction) => {
    const user = req.decoded;

    if (!user?.id) {
      return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'You must be logged in to continue')({});
    }

    if (user?.role !== role) {
      return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, `Only ${role} can perform this action`)({});
    }

    return next();
  });
