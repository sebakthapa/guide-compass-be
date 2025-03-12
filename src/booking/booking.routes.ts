import { Router } from 'express';
import * as cont from './booking.controllers';
import { validateData } from '../middlewares/validateData';
import * as schemas from './booking.schemas';
import { authorizeUser, verifyToken } from '../middlewares/verifyToken';
import * as validators from './booking.validators';

const router = Router();

router.post(
  '/',
  verifyToken,
  authorizeUser,
  validateData(schemas.GUIDE_BOOKING_SCHEMA),
  validators.validateGuideBooking,
  cont.bookingContBookGuide
);

// GET /api/bookings/guide
router.get('/guide', verifyToken, authorizeUser, cont.bookingContFetchGuideBookings);

// GET /api/bookings/user
router.get('/user', verifyToken, authorizeUser, cont.bookingContFetchUserBookings);

router.get(
  '/calendar/:guideId',
  validateData(schemas.GUIDE_BOOKING_CALENDAR_ID_SCHEMA, 'params'),
  validateData(schemas.GUIDE_BOOKINGS_CALENDAR_FETCH_SCHEMA, 'query'),
  validators.validateDateRange,
  cont.bookingContFetchGuideBookingCalendar
);

router.patch(
  '/:bookingId/accept',
  verifyToken,
  authorizeUser,
  validators.validateBookingBelongsToGuide,
  cont.bookingContAcceptBooking
);

router.patch(
  '/:bookingId/reject',
  verifyToken,
  authorizeUser,
  validators.validateBookingBelongsToGuide,
  cont.bookingContRejectBooking
);

router.delete(
  '/:bookingId',
  verifyToken,
  authorizeUser,
  validators.validateBookingBelongsToUser,
  cont.bookingContDeleteBooking
);

export default router;
