import { Request, Response } from 'express';
import { catchAsyncFile } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { File } from 'formidable';
import { updateUserById, uploadUserProfile } from './users.services';

export const usersContUpdateDetails = catchAsyncFile(async (req: Request, res: Response) => {
  const data = req.body;

  // @ts-expect-error image doesn't exist on req
  const [image] = (req.image as File[]) || [];
  const user = req.decoded!;

  if (!image) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Invalid image received`)({});
  }

  // TODO: delete previous profile image
  const uploadedFile = await uploadUserProfile(image, user?.id);
  const imageUrl = uploadedFile.publicUrl();

  const updatedUser = await updateUserById(user.id, { ...data, imageUrl });
  const { password: _pw, ...updatedUserWithoutPw } = updatedUser;

  return sendSuccessRes(StatusCodes.OK)(res, 'User details updated successfully')(updatedUserWithoutPw);
});
