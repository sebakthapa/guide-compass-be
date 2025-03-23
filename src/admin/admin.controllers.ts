import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { fetchUsersWithPagination } from '../users/users.services';
import { fetchGuideListWithPagination } from '../guide/guide.services';

export const adminContFetchUsers = catchAsync(async (req: Request, res: Response) => {
  const { limit, page, isBanned } = req.body;

  const users = await fetchUsersWithPagination({ limit, page, isBannedStatus: isBanned });

  return sendSuccessRes(StatusCodes.OK)(res, 'Users List fetched successfully')(users);
});

export const adminContFetchGuides = catchAsync(async (req: Request, res: Response) => {
  const { isBanned, ...filters } = req.body;

  const guides = await fetchGuideListWithPagination(filters, isBanned);

  return sendSuccessRes(StatusCodes.OK)(res, 'Guides list fetched successfully')(guides);
});
