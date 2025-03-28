import Joi from 'joi';
import { z } from 'zod';
import { PASSWORD_SCHEMA } from '../auth/auth.schemas';

export const USER_SEARCH_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
});

export const USER_UPDATE_SCHEMA = Joi.object({
  fullname: Joi.string(),
  username: Joi.string().alphanum(),
});

export const CHANGE_PASSWORD_SCHEMA = z.object({
  currentPassword: z.string(),
  newPassword: PASSWORD_SCHEMA,
});
