import { Router } from 'express';
import * as cont from './admin.controllers';
import * as schemas from './admin.schema';
import { validateData, validateZodSchema } from '../middlewares/validateData';
import { validateGuideProfileAcceptOrReject } from './admin.validators';

const router = Router();

router.get('/users', validateData(schemas.USER_LIST_FETCH_SCHEMA), cont.adminContFetchUsers);
router.get('/guides', validateData(schemas.USER_LIST_FETCH_SCHEMA), cont.adminContFetchGuides);
router.get(
  '/guides/pending',

  validateZodSchema(schemas.PENDING_GUIDE_FETCH_SCHEMA),
  cont.adminContFetchGuidesUnderReview
);

router.patch(
  '/guides/reject',
  validateData(schemas.GUIDE_PROFILE_REJECT_SCHEMA),
  validateGuideProfileAcceptOrReject,
  cont.adminContRejectGuideProfile
);
router.patch(
  '/guides/accept',
  validateData(schemas.GUIDE_PROFILE_ACCEPT_SCHEMA),
  validateGuideProfileAcceptOrReject,
  cont.adminContAcceptGuideProfile
);

export default router;
