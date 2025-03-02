import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { GuideBookingReqBody } from './booking.types';
import { fetchGuideDetailsById } from '../guide/guide.services';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { getCoordinates } from '../utils/geocoding';

export const validateGuideBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { guideId, destination } = req.body as GuideBookingReqBody;
  const user = req.decoded!;

  if (guideId === user?.id) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Can't book onself`)({});
  }

  const guide = await fetchGuideDetailsById(guideId);
  if (!guide) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Guide doesn't exist`)({});
  }

  const coordinates = await getCoordinates(destination);

  if (!coordinates) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Please enter a valid location')({});
  }

  return next();
});
