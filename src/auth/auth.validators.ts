import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { SignupRequestBody, VerifyOtpRequestBody } from '../types/auth.types';
import { getUserByEmail, getUserByIdentifier, getUserByUsername } from '../users/users.services';
import { isEmpty } from 'lodash';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { decryptData } from '../utils/encryption';
import { getVerificationCodeByIdentifier } from '../verificationCode/verificationTokens.services';
import { SIGNUP_OTP_IDENTIFIER } from './auth.config';
import moment from 'moment';
import { sec } from '../utils/seconds';

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

export const validateResendSignupOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token;

  let userData: SignupRequestBody | null = null;

  try {
    userData = JSON.parse(decryptData(token)) as SignupRequestBody;
  } catch {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid Data provided')({});
  }

  if (!userData) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid Data provided')({});
  }

  const existingOtps = await getVerificationCodeByIdentifier(userData[SIGNUP_OTP_IDENTIFIER], 'SIGNIN');

  if (existingOtps.length > 0) {
    // Find the latest OTP based on createdAt
    const latestOtp = existingOtps.reduce((latest, current) =>
      moment(current.createdAt).isAfter(moment(latest.createdAt)) ? current : latest
    );

    // Check if the latest OTP was created less than 1 minute ago
    if (moment().diff(moment(latestOtp.createdAt), 'seconds') < 5) {
      return sendFailureRes(StatusCodes.TOO_MANY_REQUESTS)(res, 'Please wait before requesting a new OTP')({});
    }
  }

  return next();
});

export const validateResetPasswordInitiate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const user = await getUserByIdentifier(email);

  if (!user) {
    return sendFailureRes(StatusCodes.NOT_FOUND)(res, 'User with provided email does not exist')({});
  }

  const existingOtps = await getVerificationCodeByIdentifier(email, 'FORGOT_PASSWORD');

  if (existingOtps.length > 0) {
    // Find the latest OTP based on createdAt
    const latestOtp = existingOtps.reduce((latest, current) =>
      moment(current.createdAt).isAfter(moment(latest.createdAt)) ? current : latest
    );

    // Check if the latest OTP was created less than 1 minute ago
    // if (moment().diff(moment(latestOtp.createdAt), 'seconds') < sec('10s')) {
    //   return sendFailureRes(StatusCodes.TOO_MANY_REQUESTS)(res, 'Too frequent request please wait!')({});
    // }
  }

  return next();
});
