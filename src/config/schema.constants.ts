import Joi from 'joi';

export const PAGINATION_SCHEMA = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
});

export const ID_SCHEMA = Joi.string().hex().length(24);
