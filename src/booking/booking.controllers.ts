import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import * as services from './booking.services';
import { BookingCalendarFetchReqBody, GuideBookingFetchReqBody, GuideBookingReqBody } from './booking.types';
import { createPaymentEntry, deletePaymentByBookingId } from '../payments/payments.services';
import { getDistance } from '../utils/geocoding';
import { fetchGuideDetailsById } from '../guide/guide.services';
import { calculateBookingPrice, generateEsewasignature } from '../payments/payment.utils';
import { EsewaPaymentDetails } from '../types/payment.types';

export const bookingContBookGuide = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;
  const { guideId, ...otherDetails } = req.body as GuideBookingReqBody;

  // TODO: put all these in transaction
  const bookingData = await services.createNewBooking(user.id, guideId, otherDetails);
  const guide = (await fetchGuideDetailsById(bookingData.guideId))!;
  const { geometry: _geometry, ...guideLocation } = guide.location!;

  const distance = await getDistance(bookingData.destination, guideLocation);
  if (distance === null) {
    return sendFailureRes(StatusCodes.SERVICE_UNAVAILABLE)(
      res,
      'An unexpected error occured during price calculation! Try again.'
    )({});
  }

  const amount = calculateBookingPrice(
    guide.dailyRate!,
    bookingData.numberOfPeople,
    distance,
    bookingData.numberOfPeople
  );

  const deliveryCharge = 0;
  const serviceCharge = 0;
  const taxAmount = 0;
  const totalAmount = Math.ceil(amount + deliveryCharge + serviceCharge + taxAmount);
  const productCode = 'EPAYTEST';
  const signedFields = `total_amount,transaction_uuid,product_code`;
  const paymentData = await createPaymentEntry(bookingData.id, totalAmount);

  const signedFieldsWithValue = `total_amount=${totalAmount},transaction_uuid=${paymentData.id},product_code=${productCode}`;
  const signature = generateEsewasignature(signedFieldsWithValue);

  const paymentDetails: EsewaPaymentDetails = {
    amount: amount,
    failure_url: 'https://developer.esewa.com.np/failure',
    product_code: productCode,
    success_url: `https://developer.esewa.com.np/success`,
    product_delivery_charge: deliveryCharge,
    product_service_charge: serviceCharge,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    transaction_uuid: paymentData.id,
    signed_field_names: signedFields,
    signature,
  };

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide booked successfully')({ paymentDetails, bookingData });
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

  await deletePaymentByBookingId(id);
  const data = await services.deleteBookingById(id);

  return sendSuccessRes(StatusCodes.OK)(res, 'Booking deleted successfully')(data);
});
