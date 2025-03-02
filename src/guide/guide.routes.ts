import { Router } from 'express';
import * as cont from './guide.controllers';
import * as validators from './guide.validators';
import * as schemas from './guide.schemas';
import { validateData } from '../middlewares/validateData';
import { authorizeUser, verifyToken } from '../middlewares/verifyToken';

const router = Router();

// GET /api/guides
router.get('/', verifyToken, authorizeUser, cont.guideContFetchSelfDetails);

// PATCH /api/guides/become-guide
router.patch('/become-guide', verifyToken, authorizeUser, cont.guideContBecomeGuide);

// PATCH /api/guides/
router.patch(
  '/',
  verifyToken,
  authorizeUser,
  validateData(schemas.GUIDE_UPDATE_DETAILS_SCHEMA),
  validators.validateDetailsUpdateRequest,
  cont.guideContUpdateDetails
);

// GET /api/guides/expertise
router.get('/expertises', cont.guideContFetchAllExpertise);

// GET /api/guide/expertise
router.get('/languages', cont.guideContFetchAllLanguages);

// GET/api/guides/list
router.post('/list', validateData(schemas.GUIDE_LIST_FETCH_SCHEMA), cont.guideContFetchGuidesList);

export default router;
