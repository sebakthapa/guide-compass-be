import Joi from 'joi';

export const PAGINATION_SCHEMA = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
});
