import { VerificationToken } from '@prisma/client';
import prisma from '../db';

export const addIntoVerificationToken = (data: VerificationToken) => {
  return prisma.verificationToken.create({ data });
};

export const deleteVerificationToken = (identifier: string, token: string) => {
  return prisma.verificationToken.delete({
    where: {
      identifier_token: { identifier, token },
    },
  });
};
