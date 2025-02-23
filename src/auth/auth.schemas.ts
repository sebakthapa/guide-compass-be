import Joi from 'joi';

export const SIGNUP_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(6).max(256).required(),
});

export const LOGIN_SCHEMA = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
});

export const OPT_VERIFICATION_SCHEMA = Joi.object({
  otp: Joi.string().length(6).required(),
  token: Joi.string().required(),
});
