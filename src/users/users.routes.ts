import { Router } from 'express';
import * as cont from './users.controllers';
import { uploadFile } from '../middlewares/uploadFile';
import { authorizeUser, verifyToken } from '../middlewares/verifyToken';
import { validateData } from '../middlewares/validateData';
import { USER_UPDATE_SCHEMA } from './users.schemas';
import { validateImageForUserupdate } from './users.validators';
// import * as cont from './users.controllers';

const router = Router();

router.patch(
  '/',
  verifyToken,
  authorizeUser,
  uploadFile('image', false),
  validateData(USER_UPDATE_SCHEMA),
  validateImageForUserupdate,

  cont.usersContUpdateDetails
);

export default router;
