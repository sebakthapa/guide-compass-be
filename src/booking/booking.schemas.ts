import Joi from 'joi';
import { BOOKING_STATUS } from './booking.config';
import { PAGINATION_SCHEMA } from '../config/schema.constants';

export const GUIDE_BOOKING_SCHEMA = Joi.object({
  guideId: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  totalAmount: Joi.number().min(100),
  numberOfPeople: Joi.number().integer().min(1),
  destination: Joi.string().required(),
  message: Joi.string(),
});

export const GUIDE_BOOKINGS_FETCH_SCHEMA = Joi.object({
  status: Joi.string().valid(...BOOKING_STATUS),
}).concat(PAGINATION_SCHEMA);
