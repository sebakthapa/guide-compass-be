import { Router } from 'express';
import authRouter from './auth/auth.routes';
import guideRouter from './guide/guide.routes';
import userRouter from './users/users.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/guides', guideRouter);
router.use('/users', userRouter);

export default router;
