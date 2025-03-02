import { Router } from 'express';
import authRouter from './auth/auth.routes';
import guideRouter from './guide/guide.routes';
import userRouter from './users/users.routes';
import bookingRouter from './booking/booking.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/guides', guideRouter);
router.use('/users', userRouter);
router.use('/booking', bookingRouter);

export default router;
