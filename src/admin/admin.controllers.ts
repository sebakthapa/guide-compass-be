import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { fetchUsersWithPagination, updateUserById } from '../users/users.services';
import {
  changeGuideVerificationStatus,
  fetchGuideDetailsByVerificationStatus,
  fetchGuideListWithPagination,
} from '../guide/guide.services';
import * as services from './admin.services';

export const adminContFetchUsers = catchAsync(async (req: Request, res: Response) => {
  const { limit, page, isBanned, roles } = req.body;

  const users = await fetchUsersWithPagination({ limit, page, isBannedStatus: isBanned, roles });

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
  services.sendGuideProfileRejectedEmail(data.user.email, remarks);

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide profile rejected')(data);
});

export const adminContAcceptGuideProfile = catchAsync(async (req: Request, res: Response) => {
  const { guideId, remarks } = req.body;

  const data = await changeGuideVerificationStatus(guideId, 'VERIFIED', remarks);
  services.sendGuideProfileAcceptedEmail(data.user.email);

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide profile verified')(data);
});

export const adminContBanUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const data = await updateUserById(userId, { isBanned: true });

  return sendSuccessRes(StatusCodes.OK)(res, 'User banned')(data);
});
export const adminContUnbanUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const data = await updateUserById(userId, { isBanned: false });

  return sendSuccessRes(StatusCodes.OK)(res, 'User banned')(data);
});
