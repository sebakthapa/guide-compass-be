import Joi from 'joi';

export const GUIDE_BOOKING_SCHEMA = Joi.object({
  guideId: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  totalAmount: Joi.number().min(100),
  numberOfPeople: Joi.number().integer().min(1),
  destination: Joi.string().required(),
  message: Joi.string(),
});
