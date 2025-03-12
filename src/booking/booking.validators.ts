import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { BookingCalendarFetchReqBody, GuideBookingReqBody } from './booking.types';
import { fetchGuideDetailsById } from '../guide/guide.services';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { getCoordinates } from '../utils/geocoding';
import { badRequest } from '@hapi/boom';
import { fetchBookingById, fetchGuideBookingCalendarDates } from './booking.services';
import { isEmpty } from 'lodash';

export const validateGuideBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { guideId, destination, startDate, endDate } = req.body as GuideBookingReqBody;
  const user = req.decoded!;

  if (guideId === user?.id) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Can't book oneself`)({});
  }

  const guide = await fetchGuideDetailsById(guideId);
  if (!guide) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Guide doesn't exist`)({});
  }

  const coordinates = await getCoordinates(destination);

  if (!coordinates) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Please enter a valid location')({});
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate date format
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Invalid date format')({});
  }

  // Validate that start date is before end date
  if (start > end) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Start date must be before end date')({});
  }

  // Calculate the difference in milliseconds
  const differenceInMs = end.getTime() - start.getTime(); // Fixed calculation (was reversed)
  if (differenceInMs === 0) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Start and end dates cannot be same')({});
  }

  // Convert to days (1000ms * 60s * 60m * 24h = 86400000ms in a day)
  const differenceInDays = differenceInMs / 86400000;

  // Check if the interval is longer than 12 weeks
  if (differenceInDays > 12 * 7) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Date range cannot be longer than 12 weeks')({});
  }

  // Get already booked dates for the guide
  const alreadyBookedDates = await fetchGuideBookingCalendarDates(guideId, startDate, endDate);

  const conflictingDate = Object.values(alreadyBookedDates).flat();

  if (!isEmpty(conflictingDate)) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'One or more requested date is already booked')({
      bookedDates: conflictingDate,
    });
  }

  // If we reach here, all validations have passed
  return next();
});

export const validateDateRange = catchAsync((req: Request, res: Response, next: NextFunction) => {
  const { from, to } = req.query as unknown as BookingCalendarFetchReqBody;

  // Parse the dates
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // Validate date format
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw badRequest('Invalid date format. Please provide ISO date strings (YYYY-MM-DD)');
  }

  // Validate that from date is before to date
  if (fromDate > toDate) {
    throw badRequest('From date must be before to date');
  }

  // Calculate the difference in milliseconds
  const differenceInMs = toDate.getTime() - fromDate.getTime();

  // Convert to days (1000ms * 60s * 60m * 24h = 86400000ms in a day)
  const differenceInDays = differenceInMs / 86400000;

  // Check if the interval is longer than 1 year (365 days)
  // Using 366 to account for leap years
  if (differenceInDays > 366) {
    throw badRequest('Date range cannot be longer than 1 year');
  }

  return next();
});

export const validateBookingBelongsToGuide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.bookingId;
  const user = req.decoded!;

  const booking = await fetchBookingById(id);

  if (!booking) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Booking does not exist')({});
  }

  if (booking?.guideId !== user.id) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, `You can only modify your booking`)({});
  }

  return next();
});
export const validateBookingBelongsToUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.bookingId;
  const user = req.decoded!;

  const booking = await fetchBookingById(id);

  if (!booking) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Booking does not exist')({});
  }

  if (booking?.customerId !== user.id) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, `You can only modify your bookings`)({});
  }

  return next();
});
