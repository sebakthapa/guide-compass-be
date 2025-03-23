import Joi from 'joi';
import { GUIDE_LIST_FETCH_SCHEMA } from '../guide/guide.schemas';

export const USER_LIST_FETCH_SCHEMA = Joi.object({
  isBanned: Joi.boolean().valid(true, false),
}).concat(GUIDE_LIST_FETCH_SCHEMA);
