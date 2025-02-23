import { Router } from 'express';
import authRouter from './auth/auth.routes';
import guideRouter from './guide/guide.routes';
import userRouter from './users/users.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/guide', guideRouter);
router.use('/user', userRouter);

export default router;
