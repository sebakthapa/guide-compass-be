import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { buildError, ResponseError } from '../utils/buildError';
import { sendFailureRes } from '../utils/formatResponse';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const methodNotAllowed = (req: Request, res: Response) => {
  sendFailureRes(HttpStatus.METHOD_NOT_ALLOWED)(res, 'Method not allowed')({});
};

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export const genericErrorHandler = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
  const error = buildError(err);

  sendFailureRes(error.code)(res, error.message)(error.details || {});
};
