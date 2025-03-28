import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { validate, validateZod } from '../utils/validate';
import { ZodError, ZodSchema } from 'zod';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';

type DataSource = 'body' | 'query' | 'params';
export const validateData =
  (schema: Schema, dataSource: DataSource = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validate(req[dataSource], schema);

      return next();
    } catch (error) {
      next(error);
    }
  };

export const validateZodSchema =
  (schema: ZodSchema, dataSource: DataSource = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateZod(req[dataSource], schema);

      return next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'validation_error')(error.formErrors.fieldErrors);
      } else {
        next(error);
      }
    }
  };
