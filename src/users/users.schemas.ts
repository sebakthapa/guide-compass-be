import Joi from 'joi';

export const USER_SEARCH_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
});
