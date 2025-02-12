import { Router } from 'express';
import * as cont from './verificationTokens.controllers';
import * as schemas from './verificationTokens.schema';
import { validateData } from '../middlewares/validateData';

const router = Router();

export default router;
