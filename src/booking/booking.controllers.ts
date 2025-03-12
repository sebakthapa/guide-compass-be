import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import * as services from './booking.services';
import { BookingCalendarFetchReqBody, GuideBookingFetchReqBody, GuideBookingReqBody } from './booking.types';

export const bookingContBookGuide = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;
  const { guideId, ...otherDetails } = req.body as GuideBookingReqBody;

  const bookingData = await services.createNewBooking(user.id, guideId, otherDetails);

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide booked successfully')(bookingData);
});

export const bookingContFetchGuideBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;
  const filters = req.query as unknown as GuideBookingFetchReqBody;

  const fetchedData = await services.fetchGuideBookingsWithFilters(user.id, filters);

  return sendSuccessRes(StatusCodes.OK)(res, 'Booking data fetched successfully')(fetchedData);
});

export const bookingContFetchGuideBookingCalendar = catchAsync(async (req: Request, res: Response) => {
  const { from, to } = req.query as unknown as BookingCalendarFetchReqBody;
  const { guideId } = req.params;

  const data = await services.fetchGuideBookingCalendarDates(guideId, from, to);

  return sendSuccessRes(StatusCodes.OK)(res, 'Calendar data fetched successfully')(data);
});

export const bookingContFetchUserBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;
  const filters = req.query as unknown as GuideBookingFetchReqBody;

  const fetchedData = await services.fetchUserBookingsWithFilters(user.id, filters);

  return sendSuccessRes(StatusCodes.OK)(res, 'Booking data fetched successfully')(fetchedData);
});

export const bookingContAcceptBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.bookingId;

  const data = await services.alterBookingStatus(id, 'ACCEPTED');

  return sendSuccessRes(StatusCodes.OK)(res, 'status changed successfully')(data);
});

export const bookingContRejectBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.bookingId;

  const data = await services.alterBookingStatus(id, 'REJECTED');

  return sendSuccessRes(StatusCodes.OK)(res, 'status changed successfully')(data);
});

export const bookingContDeleteBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.bookingId;

  const data = await services.deleteBookingById(id);

  return sendSuccessRes(StatusCodes.OK)(res, 'Booking deleted successfully')(data);
});
