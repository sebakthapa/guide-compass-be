import { BookingStatus, Prisma } from '@prisma/client';
import prisma from '../db';
import { GuideBookingFetchReqBody } from './booking.types';
import { badRequest } from '@hapi/boom';

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

export const fetchBookingById = (id: string) => {
  return prisma.booking.findFirst({ where: { id } });
};

export const fetchGuideBookingsWithFilters = (guideId: string, filters: GuideBookingFetchReqBody) => {
  const { status, page = 1, limit = 15 } = filters;

  return prisma.booking.findMany({
    where: { status, guideId },
    skip: (page - 1) * limit,
    take: limit,
    include: { customer: { omit: { password: true } }, guide: { omit: { password: true } } },
  });
};
export const fetchUserBookingsWithFilters = (customerId: string, filters: GuideBookingFetchReqBody) => {
  const { status, page = 1, limit = 15 } = filters;

  return prisma.booking.findMany({
    where: { status, customerId },
    skip: (page - 1) * limit,
    take: limit,
    include: { customer: { omit: { password: true } }, guide: { omit: { password: true } } },
  });
};

export const fetchGuideBookingCalendarDates = async (
  guideId: string,
  from: string,
  to: string,
  status: BookingStatus = 'ACCEPTED'
) => {
  // Parse the ISO date strings to Date objects
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // Ensure the dates are valid
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw badRequest('Invalid date format. Please provide ISO date strings (YYYY-MM-DD).');
  }

  // Fetch bookings that overlap with the specified date range
  const bookings = await prisma.booking.findMany({
    where: {
      guideId,
      AND: [
        {
          OR: [
            // Booking starts within the date range
            {
              startDate: {
                gte: fromDate,
                lte: toDate,
              },
            },
            // Booking ends within the date range
            {
              endDate: {
                gte: fromDate,
                lte: toDate,
              },
            },
            // Booking spans across the date range
            {
              startDate: { lt: fromDate },
              endDate: { gt: toDate },
            },
          ],
        },
        { status },
      ],
    },
    select: {
      startDate: true,
      endDate: true,
    },
  });

  // Create a map to store occupied dates by month
  const occupiedDatesByMonth: Record<string, string[]> = {};

  // Helper function to get month key in YYYY-MM format
  const getMonthKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  // Initialize the result object with all months in the date range
  const currentMonth = new Date(fromDate);
  currentMonth.setDate(1); // Set to first day of month

  while (currentMonth <= toDate) {
    const monthKey = getMonthKey(currentMonth);
    occupiedDatesByMonth[monthKey] = [];

    // Move to the next month
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  // Process each booking to extract all dates between start and end
  bookings.forEach((booking) => {
    // Ensure we're working with Date objects
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    // Adjust the start date if it's before the fromDate
    const effectiveStartDate = startDate < fromDate ? fromDate : startDate;

    // Adjust the end date if it's after the toDate
    const effectiveEndDate = endDate > toDate ? toDate : endDate;

    // Loop through each day in the booking (within our date range)
    const currentDate = new Date(effectiveStartDate);

    while (currentDate <= effectiveEndDate) {
      const monthKey = getMonthKey(currentDate);

      // Only add dates for months that are in our result object
      if (occupiedDatesByMonth[monthKey] !== undefined) {
        // Format as YYYY-MM-DD
        const formattedDate = currentDate.toISOString().split('T')[0];

        // Add to the result if not already present
        if (!occupiedDatesByMonth[monthKey].includes(formattedDate)) {
          occupiedDatesByMonth[monthKey].push(formattedDate);
        }
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Sort the dates in each month array
  Object.keys(occupiedDatesByMonth).forEach((monthKey) => {
    occupiedDatesByMonth[monthKey].sort();
  });

  return occupiedDatesByMonth;
};
export const alterBookingStatus = (bookingId: string, status: BookingStatus) => {
  return prisma.booking.update({ where: { id: bookingId }, data: { status } });
};
export const deleteBookingById = (bookingId: string) => {
  return prisma.booking.delete({ where: { id: bookingId } });
};
