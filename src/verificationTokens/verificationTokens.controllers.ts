import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import * as services from './verificationTokens.services';

export const verificationTokenContAddToken = catchAsync(async (req: Request, res: Response) => {
  return sendSuccessRes(StatusCodes.OK)(res, 'Verification token added successfully')({});
});
