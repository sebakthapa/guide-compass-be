import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import * as services from './booking.services';
import { GuideBookingFetchReqBody, GuideBookingReqBody } from './booking.types';

export const bookingContBookGuide = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;
  const { guideId, ...otherDetails } = req.body as GuideBookingReqBody;
  const bookingData = await services.createNewBooking(guideId, user.id, otherDetails);

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide booked successfully')(bookingData);
});

export const bookingContFetchGuideBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;
  const filters = req.query as unknown as GuideBookingFetchReqBody;

  const fetchedData = await services.fetchGuideBookingsWithFilters(user.id, filters);

  return sendSuccessRes(StatusCodes.OK)(res, 'Booking data fetched successfully')(fetchedData);
});
