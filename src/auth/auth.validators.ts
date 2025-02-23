import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { SignupRequestBody, VerifyOtpRequestBody } from '../types/auth.types';
import { getUserByEmail, getUserByUsername } from '../users/users.services';
import { isEmpty } from 'lodash';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { decryptData } from '../utils/encryption';

export const validateDuplicateDataForSignup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, username } = req.body as SignupRequestBody;

  const userByEmail = await getUserByEmail(email);

  if (!isEmpty(userByEmail)) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Email is already registered')({});
  }

  const userByUsername = await getUserByUsername(username);

  if (!isEmpty(userByUsername)) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Username is already taken')({});
  }

  return next();
});

export const validateDuplicateDataForSignupOtpVerification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body as VerifyOtpRequestBody;

    let userData: SignupRequestBody | null = null;

    try {
      userData = JSON.parse(decryptData(token)) as SignupRequestBody;
    } catch (error) {
      return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid Data provided')({});
    }

    const userByEmail = await getUserByEmail(userData.email);

    if (!isEmpty(userByEmail)) {
      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'OTP already verified! Please refresh the page')({});
    }

    const userByUsername = await getUserByUsername(userData.username);

    if (!isEmpty(userByUsername)) {
      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'OTP already verified! Please refresh the page')({});
    }

    return next();
  }
);
