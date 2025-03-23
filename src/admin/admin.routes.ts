import { Router } from 'express';
import * as cont from './admin.controllers';
import * as schemas from './admin.schema';
import { validateData } from '../middlewares/validateData';

const router = Router();

router.get('/users', validateData(schemas.USER_LIST_FETCH_SCHEMA), cont.adminContFetchUsers);
router.get('/guides', validateData(schemas.USER_LIST_FETCH_SCHEMA), cont.adminContFetchGuides);

export default router;
