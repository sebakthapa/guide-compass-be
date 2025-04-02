import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { processEsewaToken } from './payment.utils';
import { updatePaymentById } from './payments.services';

export const paymentContEsewaPaymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const paymentDetails = processEsewaToken(token);

  if (!paymentDetails) {
    sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'INVALID TOKEN')({});
  }

  if (paymentDetails.status === 'COMPLETE') {
    await updatePaymentById(paymentDetails.transaction_uuid, { status: 'COMPLETED' });
  }

  return sendSuccessRes(StatusCodes.OK)(res, 'Payment Successfull')({});
});
