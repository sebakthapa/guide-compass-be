import { Prisma } from '@prisma/client';
import prisma from '../db';
import { GuideBookingFetchReqBody } from './booking.types';

export const createNewBooking = (
  customerId: string,
  guideId: string,
  data: Omit<Prisma.BookingCreateInput, 'guide' | 'customer'>
) => {
  const { endDate, startDate, ...otherData } = data;

  return prisma.booking.create({
    data: {
      guideId,
      customerId,
      endDate: new Date(endDate).toISOString(),
      startDate: new Date(startDate).toISOString(),
      ...otherData,
    },
  });
};

export const fetchGuideBookingsWithFilters = (guideId: string, filters: GuideBookingFetchReqBody) => {
  const { status, page = 1, limit = 15 } = filters;

  return prisma.booking.findMany({ where: { status, guideId }, skip: (page - 1) * limit, take: limit });
};
