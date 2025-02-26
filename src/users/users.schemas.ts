import Joi from 'joi';

export const USER_SEARCH_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
});

export const USER_UPDATE_SCHEMA = Joi.object({
  fullname: Joi.string(),
  username: Joi.string().alphanum(),
});
