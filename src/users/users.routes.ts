import { Router } from 'express';
import * as cont from './users.controllers';
import { uploadFile } from '../middlewares/uploadFile';
// import * as cont from './users.controllers';

const router = Router();

router.patch('/', uploadFile('image', false), cont.usersContUpdateDetails);

export default router;
