import { Request, Response } from 'express';
import { catchAsyncFile } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';

export const usersContUpdateDetails = catchAsyncFile((req: Request, res: Response) => {
  // const uploadFile = await uploadUserProfile(files)

  return sendSuccessRes(StatusCodes.OK)(res, 'User details updated successfully')({});
});
