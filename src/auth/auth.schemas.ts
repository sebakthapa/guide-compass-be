import Joi from 'joi';

export const USER_SIGNUP_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(256).required(),
  username: Joi.string().alphanum().required(),
});

export const USER_LOGIN_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(256).required(),
});
