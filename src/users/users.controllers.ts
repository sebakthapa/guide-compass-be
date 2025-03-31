import { Request, Response } from 'express';
import { catchAsyncFile } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { File } from 'formidable';
import * as services from './users.services';
import { comparePassword, hashPassword } from '../utils/hashPassword';

export const usersContUpdateDetails = catchAsyncFile(async (req: Request, res: Response) => {
  const data = req.body;

  // @ts-expect-error image doesn't exist on req
  const [image] = (req.image as File[]) || [];
  const user = req.decoded!;

  if (!image) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Invalid image received`)({});
  }

  // TODO: delete previous profile image
  const uploadedFile = await services.uploadUserProfile(image, user?.id);
  const imageUrl = uploadedFile.publicUrl();

  const updatedUser = await services.updateUserById(user.id, { ...data, image: imageUrl });
  const { password: _pw, ...updatedUserWithoutPw } = updatedUser;

  return sendSuccessRes(StatusCodes.OK)(res, 'User details updated successfully')(updatedUserWithoutPw);
});

export const userContChangePassword = catchAsyncFile(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.decoded!;
  const userDetails = (await services.getUserById(user.id))!;

  const isPasswordCorrect = await comparePassword(currentPassword, userDetails?.password);
  if (!isPasswordCorrect) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid password')({});
  }

  const hashedPassword = await hashPassword(newPassword);
  const updatedData = await services.updateUserById(userDetails.id, { password: hashedPassword });

  const returningData = { ...updatedData, password: undefined };

  return sendSuccessRes(StatusCodes.OK)(res, 'Password changed successfully')(returningData);
});
