import Joi from 'joi';
import { ID_SCHEMA } from '../config/schema.constants';

export const PACKAGE_CREATE_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  currency: Joi.string().valid('USD', 'NPR', 'EUR', 'INR').default('USD'), // Add more as needed
  duration: Joi.number().integer().min(1).required(), // Duration in days
  price: Joi.number().integer().min(1).required(), // Duration in days
  location: Joi.string().min(3).max(200).required(),
  // images: Joi.array().items(Joi.string().uri()).max(10), // Max 10 image URLs
});

export const PACKAGE_UPDATE_SCHEMA = PACKAGE_CREATE_SCHEMA.fork(
  Object.keys(PACKAGE_CREATE_SCHEMA.describe().keys),
  (schema) => schema.optional()
);

export const PACKAGE_UPDATE_PARAMS_SCHEMA = Joi.object({
  packageId: ID_SCHEMA.required(),
});
export const PACKAGE_DELETE_PARAMS_SCHEMA = Joi.object({
  packageId: ID_SCHEMA.required(),
});
export const GUIDE_PACKAGES_FETCH_SCHEMA = Joi.object({
  guideId: ID_SCHEMA.required(),
});
