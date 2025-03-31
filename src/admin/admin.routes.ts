import { Router } from 'express';
import * as cont from './admin.controllers';
import * as schemas from './admin.schema';
import { validateData, validateZodSchema } from '../middlewares/validateData';
import * as validators from './admin.validators';

const router = Router();

router.post('/users/list', validateData(schemas.USER_LIST_FETCH_SCHEMA), cont.adminContFetchUsers);
router.get('/guides', validateData(schemas.USER_LIST_FETCH_SCHEMA), cont.adminContFetchGuides);
router.get(
  '/guides/pending',

  validateZodSchema(schemas.PENDING_GUIDE_FETCH_SCHEMA),
  cont.adminContFetchGuidesUnderReview
);

router.patch(
  '/guides/reject',
  validateData(schemas.GUIDE_PROFILE_REJECT_SCHEMA),
  validators.validateGuideProfileAcceptOrReject,
  cont.adminContRejectGuideProfile
);
router.patch(
  '/guides/accept',
  validateData(schemas.GUIDE_PROFILE_ACCEPT_SCHEMA),
  validators.validateGuideProfileAcceptOrReject,
  cont.adminContAcceptGuideProfile
);

router.patch(
  '/users/:userId/ban',
  validateData(schemas.USER_ALTER_BAN_SCHEMA, 'params'),
  validators.validateUserBanOrUnban('ban'),
  cont.adminContBanUser
);
router.patch(
  '/users/:userId/unban',
  validateData(schemas.USER_ALTER_BAN_SCHEMA, 'params'),
  validators.validateUserBanOrUnban('unban'),
  cont.adminContUnbanUser
);

export default router;
