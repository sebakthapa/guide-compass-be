import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { fetchGuideDetailsById } from '../guide/guide.services';
import { getUserById } from '../users/users.services';

export const validateGuideProfileAcceptOrReject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { guideId } = req.body;

    const guideDetails = await fetchGuideDetailsById(guideId);

    if (!guideDetails) {
      return sendFailureRes(StatusCodes.NOT_FOUND)(res, 'The guide does not exist')({});
    }

    if (guideDetails.verification?.status !== 'PENDING') {
      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'The guide verification is not pending')({});
    }

    return next();
  }
);

export const validateUserBanOrUnban = (action: 'ban' | 'unban') =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const isBanning = action === 'ban';

    const userDetails = await getUserById(userId);

    if (!userDetails) {
      return sendFailureRes(StatusCodes.NOT_FOUND)(res, 'User does not exist')({});
    }

    if (isBanning) {
      if (userDetails.isBanned) {
        return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'User is already banned')({});
      }
    } else {
      if (userDetails.isBanned === false) {
        return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'User is already unbanned')({});
      }
    }

    return next();
  });
