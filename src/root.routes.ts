import { Router } from 'express';
import authRouter from './auth/auth.routes';
import guideRouter from './guide/guide.routes';
import userRouter from './users/users.routes';
import bookingRouter from './booking/booking.routes';
import packageRouter from './packages/packages.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/guides', guideRouter);
router.use('/users', userRouter);
router.use('/bookings', bookingRouter);
router.use('/packages', packageRouter);

export default router;
