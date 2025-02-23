import { Prisma, User } from '@prisma/client';
import prisma from '../db';
import { isEmail } from './users.utils';
import { uploadToBucket } from '../utils/gcloud';
import { USER_PROFILE_IMAGE_FOLDER } from './user.config';

export const createUser = async (data: Prisma.UserCreateInput) => {
  const createdUser = await prisma.user.create({ data });

  // @ts-expect-error password can't be placed as it is ommitted
  const returningUser: Omit<User, 'password'> = { ...createdUser, password: undefined };

  return returningUser;
};

export const getUserByEmail = (email: string) => {
  return prisma.user.findFirst({ where: { email } });
};

export const getUserById = (id: string) => {
  return prisma.user.findFirst({ where: { id } });
};

export const getUserByUsername = (username: string) => {
  return prisma.user.findFirst({ where: { username } });
};

export const getUserByIdentifier = (identifier: string) => {
  if (isEmail(identifier)) {
    return getUserByEmail(identifier);
  }

  return getUserByUsername(identifier);
};

export const updateUserById = (
  id: string,
  {
    fullname,
    imageUrl,
    username,
  }: {
    username?: string;
    fullname?: string;
    imageUrl?: string;
  }
) => {
  const updatingDetails: Record<string, string> = {};
  if (fullname) {
    updatingDetails.fullname = fullname;
  }
  if (username) {
    updatingDetails.username = username;
  }
  if (imageUrl) {
    updatingDetails.image = imageUrl;
  }

  return prisma.user.update({
    data: updatingDetails,
    where: {
      id,
    },
  });
};

export const uploadUserProfile = async (imagePath: string, userId: string) => {
  const [file] = await uploadToBucket(imagePath, { destination: `${USER_PROFILE_IMAGE_FOLDER}/${userId}` });

  return file;
};
