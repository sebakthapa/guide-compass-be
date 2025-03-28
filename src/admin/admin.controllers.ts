import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { fetchUsersWithPagination } from '../users/users.services';
import {
  changeGuideVerificationStatus,
  fetchGuideDetailsByVerificationStatus,
  fetchGuideListWithPagination,
} from '../guide/guide.services';

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

export const adminContFetchGuidesUnderReview = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as unknown as Record<string, number | undefined>;

  const data = await fetchGuideDetailsByVerificationStatus('PENDING', {
    page,
    limit,
    onlyGuidesHavingAllDetails: true,
  });

  return sendSuccessRes(StatusCodes.OK)(res, 'Guides under review fetched successfully')(data);
});

export const adminContRejectGuideProfile = catchAsync(async (req: Request, res: Response) => {
  const { guideId, remarks } = req.body;

  const data = await changeGuideVerificationStatus(guideId, 'REJECTED', remarks);
  // TODO: send email to guide saying it is rejected

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide profile rejected')(data);
});
export const adminContAcceptGuideProfile = catchAsync(async (req: Request, res: Response) => {
  const { guideId, remarks } = req.body;

  const data = await changeGuideVerificationStatus(guideId, 'VERIFIED', remarks);
  // TODO: send email to guide saying it is accepted

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide profile verified')(data);
});
