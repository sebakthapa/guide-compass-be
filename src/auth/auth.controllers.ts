import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { LoginRequestBody, SignupRequestBody, VerifyOtpRequestBody } from '../types/auth.types';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { decryptData, encryptData } from '../utils/encryption';
import { generateOtp, sendOtpMail, verifyOtp } from './auth.services';
import { addIntoVerificationCode } from '../verificationCode/verificationTokens.services';
import { AUTH_TOKEN_COOKIE_NAME, SIGNUP_OTP_IDENTIFIER } from './auth.config';
import { createUser, getUserByIdentifier } from '../users/users.services';
import { generateToken } from '../utils/generateToken';
import { isEmpty } from 'lodash';

export const authContValidateSignpRequest = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as SignupRequestBody;

  const hashedPassword = await hashPassword(data.password);

  const finalData = { ...data, password: hashedPassword };

  const encryptedData = encryptData(JSON.stringify(finalData));

  const otp = generateOtp();
  await sendOtpMail(otp, data.email);
  await addIntoVerificationCode({ otp, identifier: finalData[SIGNUP_OTP_IDENTIFIER], type: 'SIGNIN' });

  return sendSuccessRes(StatusCodes.OK)(res, 'Signup successfull')({ token: encryptedData });
});

export const authContVerifysignUpOtp = catchAsync(async (req: Request, res: Response) => {
  const { otp, token } = req.body as VerifyOtpRequestBody;

  let userData: SignupRequestBody | null = null;

  try {
    userData = JSON.parse(decryptData(token)) as SignupRequestBody;
    // eslint-disable-next-line no-empty
  } catch {}
  if (!userData) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid Data provided')({});
  }

  const isOtpCorrect = await verifyOtp(otp, userData[SIGNUP_OTP_IDENTIFIER]);

  if (!isOtpCorrect) {
    return sendFailureRes(StatusCodes.OK)(res, 'Incorrect/Expired OTP')({});
  }

  const createdUser = await createUser({ ...userData });

  const userdetailsWithoutPassword = { ...createdUser, password: undefined };

  const jwtToken = generateToken(res, { id: createdUser.id });

  return sendSuccessRes(StatusCodes.OK)(res, 'Signup successfull')({
    user: userdetailsWithoutPassword,
    token: jwtToken,
  });
});

export const authContLogin = catchAsync(async (req: Request, res: Response) => {
  const { identifier, password } = req.body as LoginRequestBody;

  const user = await getUserByIdentifier(identifier);

  if (isEmpty(user)) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid Credentails a')({});
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid Credentails')({});
  }

  const userWithoutPassword = { ...user, password: undefined };

  const token = generateToken(res, { id: user.id });

  return sendSuccessRes(StatusCodes.OK)(res, 'Login Successfull')({ user: userWithoutPassword, token });
});

export const authContLogout = catchAsync((req: Request, res: Response) => {
  res.clearCookie(AUTH_TOKEN_COOKIE_NAME);

  return sendSuccessRes(StatusCodes.OK)(res, 'Logout Successfull')({});
});

export const authContGetSession = catchAsync((req: Request, res: Response) => {
  const user = req.decoded!;

  return sendSuccessRes(StatusCodes.OK)(res, 'User Session retrieved')(user);
});
