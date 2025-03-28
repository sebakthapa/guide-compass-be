import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { fetchGuideDetailsById } from '../guide/guide.services';

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
