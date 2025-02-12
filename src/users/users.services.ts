import { Prisma, User } from '@prisma/client';
import prisma from '../db';
import { hashPassword } from '../utils/hashPassword';

export const createUser = async (data: Prisma.UserCreateInput) => {
  // return prisma.user.create({ data });
  const password = data.password;
  const hashedPassword = await hashPassword(password);

  const savingDetails = { ...data, password: hashedPassword };

  const createdUser = await prisma.user.create({ data: savingDetails });

  // @ts-expect-error password can't be placed as it is ommitted
  const returningUser: Omit<User, 'password'> = { ...createdUser, password: undefined };

  return returningUser;
};

export const getUserByEmail = (email: string) => {
  return prisma.user.findFirst({ where: { email } });
};
export const getuserById = (id: string) => {
  return prisma.user.findFirst({ where: { id } });
};
