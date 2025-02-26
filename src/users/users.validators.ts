import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';

export const validateImageForUserupdate = catchAsync((req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error image doesn't exist
  const [image] = req.image;

  if (!image) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Missing/Invalid image')({});
  }

  return next();
});
