import Joi from 'joi';

export const VERIFICATION_TOKEN_ADD_SCHEMA = Joi.object({
  identifier: Joi.string().required(),
  token: Joi.string().required(),
  expires: Joi.date(),
});

export const VERIFICATION_TOKEN_USE_SCHEMA = Joi.object({
  identifier: Joi.string().required(),
  token: Joi.string().required(),
});
