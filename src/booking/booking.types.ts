import { BookingStatus } from '@prisma/client';

export interface GuideBookingReqBody {
  guideId: string;
  startDate: string;
  endDate: string;
  totalAmount?: number;
  numberOfPeople: number;
  destination: string;
  message?: string;
}

export interface GuideBookingFetchReqBody {
  status?: BookingStatus;
  page: number;
  limit: number;
}

export interface BookingCalendarFetchReqBody {
  from: string;
  to: string;
}
