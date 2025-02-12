import { Router } from 'express';
import * as schemas from './auth.schemas';
import * as cont from './auth.controllers';
import { validateData } from '../middlewares/validateData';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/user', validateData(schemas.USER_SIGNUP_SCHEMA), cont.authContuserSignup);

router.post('/user/login', validateData(schemas.USER_LOGIN_SCHEMA), cont.authContUserLogin);

router.get('/session', verifyToken, cont.authContgetSession);

export default router;
