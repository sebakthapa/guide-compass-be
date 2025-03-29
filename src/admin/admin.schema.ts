import Joi from 'joi';
import { GUIDE_LIST_FETCH_SCHEMA } from '../guide/guide.schemas';
import { z } from 'zod';
import { ID_SCHEMA } from '../config/schema.constants';

export const USER_LIST_FETCH_SCHEMA = Joi.object({
  isBanned: Joi.boolean().valid(true, false),
}).concat(GUIDE_LIST_FETCH_SCHEMA);

export const PENDING_GUIDE_FETCH_SCHEMA = z.object({
  page: z.number().int().optional(),
  limit: z.number().int().optional(),
});

export const GUIDE_PROFILE_REJECT_SCHEMA = Joi.object({
  guideId: ID_SCHEMA.required(),
  remarks: Joi.string().required().min(8).max(256),
});
export const GUIDE_PROFILE_ACCEPT_SCHEMA = Joi.object({
  guideId: ID_SCHEMA.required(),
});
export const USER_ALTER_BAN_SCHEMA = Joi.object({
  userId: ID_SCHEMA.required(),
});
