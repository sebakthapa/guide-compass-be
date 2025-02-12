import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { validate } from '../utils/validate';

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
