import { Router } from 'express';
import * as cont from './users.controllers';
import { uploadFile } from '../middlewares/uploadFile';
import { authorizeUser, verifyToken } from '../middlewares/verifyToken';
import { validateData, validateZodSchema } from '../middlewares/validateData';
import * as schemas from './users.schemas';
import * as validators from './users.validators';

const router = Router();

router.patch(
  '/',
  verifyToken,
  authorizeUser,
  uploadFile('image', false),
  validateData(schemas.USER_UPDATE_SCHEMA),
  validators.validateImageForUserupdate,
  cont.usersContUpdateDetails
);

router.patch(
  '/change-password',
  verifyToken,
  authorizeUser,
  validateZodSchema(schemas.CHANGE_PASSWORD_SCHEMA),
  cont.userContChangePassword
);

export default router;
