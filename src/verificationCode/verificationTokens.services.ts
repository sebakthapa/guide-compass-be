import { Prisma, VerificationCodeType } from '@prisma/client';
import prisma from '../db';
import { USER_OTP_EXPIRES_IN } from '../auth/auth.config';

export const addIntoVerificationCode = (data: Omit<Prisma.VerificationCodeCreateInput, 'expires'>) => {
  const expires = new Date(Date.now() + USER_OTP_EXPIRES_IN);

  return prisma.verificationCode.create({
    data: { ...data, expires },
  });
};

export const deleteVerificationCode = (identifier: string, otp: string) => {
  return prisma.verificationCode.delete({
    where: {
      otp_identifier: { otp, identifier },
    },
  });
};

export const getVerificationCodeByIdentifier = (identifier: string, type: VerificationCodeType) => {
  return prisma.verificationCode.findMany({ where: { identifier, type } });
};

export const getVerificationCode = (otp: string, identifier: string, type: VerificationCodeType) => {
  return prisma.verificationCode.findUnique({
    where: { otp_identifier: { identifier, otp }, type },
    select: { otp: true, expires: true },
  });
};
