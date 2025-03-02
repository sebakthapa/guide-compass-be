import { Prisma } from '@prisma/client';
import prisma from '../db';

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
