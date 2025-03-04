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

router.get('/guide', verifyToken, authorizeUser, cont.bookingContFetchGuideBookings);

export default router;
