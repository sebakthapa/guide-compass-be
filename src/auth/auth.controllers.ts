import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { createUser, getUserByEmail } from '../users/users.services';
import { generateToken } from '../utils/generateToken';
import { AuthTokenData, UserLoginBody, UserSignupBody } from '../types/auth.types';
import { AUTH_TOKEN_COOKIE } from './auth.config';
import { comparePassword } from '../utils/hashPassword';

export const authContuserSignup = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as UserSignupBody;

  const createdUser = await createUser({ ...data, role: 'CUSTOMER' });
  const { email, id, fullname, role, username } = createdUser;
  generateToken(res, { email, id, fullname, role, username } as AuthTokenData);

  return sendSuccessRes(StatusCodes.OK)(res, 'Sign Up successfull')(createdUser);
});

export const authContUserLogin = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as UserLoginBody;
  const user = await getUserByEmail(data.email);

  if (!user) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid credentials')({});
  }

  const isValid = await comparePassword(data.password, user.password);
  if (!isValid) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid credentials aayo')({});
  }

  const { email, id, fullname, role, username } = user;

  generateToken(res, { email, id, fullname, role, username } as AuthTokenData);

  const returningData = { ...user, password: undefined };

  return sendSuccessRes(StatusCodes.OK)(res, 'Login successfull')(returningData);
});

export const authContLogout = catchAsync((req: Request, res: Response) => {
  res.clearCookie(AUTH_TOKEN_COOKIE);

  return sendSuccessRes(StatusCodes.OK)(res, 'Logout successfull')({});
});

export const authContgetSession = catchAsync((req: Request, res: Response) => {
  const user = req.decoded;

  if (!user) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'User is not logged in')({});
  }

  const returningData = { ...user, password: undefined };

  return sendSuccessRes(StatusCodes.OK)(res, 'Session data retrieved')(returningData);
});
