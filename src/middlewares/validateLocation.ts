import { NextFunction, Request, Response } from 'express';
import { getCoordinates } from '../utils/geocoding';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../utils/catchAsync';

export const validateLocation = (locationPath: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const locationPathArray = locationPath.split('.');
    let location = req;
    locationPathArray.forEach((key) => {
      // @ts-expect-error sth
      location = location[key];
    });

    if (typeof location !== 'string') {
      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Invalid Location')({});
    }

    const coordinates = await getCoordinates(location);
    if (!coordinates) {
      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Please enter a valid location')({});
    }

    return next();
  });
