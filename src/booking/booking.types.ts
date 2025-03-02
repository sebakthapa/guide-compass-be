export interface GuideBookingReqBody {
  guideId: string;
  startDate: string;
  endDate: string;
  totalAmount?: number;
  numberOfPeople: number;
  destination: string;
  message?: string;
}
