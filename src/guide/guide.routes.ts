import { Router } from 'express';
import * as cont from './guide.controllers';
import * as validators from './guide.validators';
import * as schemas from './guide.schemas';
import { validateData, validateZodSchema } from '../middlewares/validateData';
import { authorizeUser, authorizeUserRole, verifyToken } from '../middlewares/verifyToken';
import { uploadFile } from '../middlewares/uploadFile';

const router = Router();

// GET /api/guides
router.get('/', verifyToken, authorizeUserRole('GUIDE'), cont.guideContFetchSelfDetails);

router.get('/available-documents', cont.guideContFetchAvailableDocuments);

// PATCH /api/guides/become-guide
router.patch('/become-guide', verifyToken, authorizeUser, cont.guideContBecomeGuide);

// PATCH /api/guides/request-review
router.patch('/request-review', verifyToken, authorizeUserRole('GUIDE'), cont.guideContRequestProfileReview);

// PATCH /api/guides/
router.patch(
  '/',
  verifyToken,
  authorizeUserRole('GUIDE'),
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

// GET /api/guides/:guideId
router.get('/:guideId', validateData(schemas.GUIDE_FETCH_SCHEMA, 'params'), cont.guideContFetchGuideDetailsById);

router.post(
  '/document/',
  verifyToken,
  authorizeUserRole('GUIDE'),
  uploadFile('image', false),
  validateZodSchema(schemas.GUIDE_DOCUMENT_ADD_SCHEMA),
  cont.guideContAddGuideDocument
);
router.delete(
  '/document/:id',
  verifyToken,
  authorizeUserRole('GUIDE'),
  validateData(schemas.GUIDE_DOCUMENT_DELETE_SCHEMA, 'params'),
  validators.validateGuideDocumentDelete,
  cont.guideContremoveGuideDocument
);

export default router;
