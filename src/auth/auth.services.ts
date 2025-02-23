import crypto from 'node:crypto';
import { isEmpty } from 'lodash';
import { badRequest, unauthorized } from '@hapi/boom';
import { mailTransporter } from '../utils/sendMail';
import { deleteVerificationCode, getVerificationCode } from '../verificationCode/verificationTokens.services';

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const verifyOtp = async (otp: string, identifier: string) => {
  const token = await getVerificationCode(otp, identifier, 'SIGNIN');
  if (isEmpty(token)) {
    throw badRequest('Incorrect OTP');
  }
  const data = await deleteVerificationCode(identifier, otp);

  if (isEmpty(data)) {
    throw unauthorized('Incorrect OTP');
  }

  if (data.otp !== otp) {
    throw unauthorized('Incorrect OTP');
  }

  const isExpired = new Date(data.expires).getTime() < new Date().getTime();

  if (isExpired) {
    throw badRequest('OPT is already expired');
  }

  return true;
};

export const sendOtpMail = (otp: string, email: string) => {
  return mailTransporter.sendMail({
    text: `Your OTP is ${otp}`,
    to: email,
    from: 'Guide Compass accounts@guidecompass.com',
    subject: 'GuideCompass OTP Code',
  });
};
