import { Router } from 'express';
import * as cont from './guide.controllers';
import * as validators from './guide.validators';
import * as schemas from './guide.schemas';
import { validateData } from '../middlewares/validateData';
import { authorizeUser, verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.get('/', verifyToken, authorizeUser, cont.guideContFetchById);

// PATCH /api/guide/
router.patch(
  '/',
  verifyToken,
  authorizeUser,
  validateData(schemas.GUIDE_UPDATE_DETAILS_SCHEMA),
  validators.validateDetailsUpdateRequest,
  cont.guideContUpdateDetails
);

// GET /api/guide/expertise
router.get('/expertise', cont.guideContFetchAllExpertise);

// GET /api/guide/expertise
router.get('/language', cont.guideContFetchAllLanguages);

export default router;
