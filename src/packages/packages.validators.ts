import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { File } from 'formidable';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { doesPackageAlreadyExist, fetchGuidePackageByPackageId } from './packages.services';
import { fetchGuideDetailsById } from '../guide/guide.services';

export const validateCreatePackage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error sth
  const file = req.image?.[0] as File | undefined;
  const user = req.decoded!;
  const data = req.body;

  if (!file) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'image is required')({});
  }

  const duplicateColumn = await doesPackageAlreadyExist(user.id, data?.location, data?.name);

  if (duplicateColumn) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Package with same ${duplicateColumn} already exist`)({});
  }

  return next();
});

export const validateUpdatePackage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.decoded!;
  const data = req.body;
  const packageId = req.params.packageId;

  const existingPackage = await fetchGuidePackageByPackageId(packageId);
  if (!existingPackage) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Package does not exist')({});
  }

  if (existingPackage.guideId !== user.id) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'You cannot modify details of this package')({});
  }

  const duplicateColumn = await doesPackageAlreadyExist(user.id, data?.location, data?.name, packageId);

  if (duplicateColumn) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `Another package with same ${duplicateColumn} already exist`)(
      {}
    );
  }

  return next();
});
export const validatePackageDelete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.decoded!;
  const packageId = req.params.packageId;

  const existingPackage = await fetchGuidePackageByPackageId(packageId);
  if (!existingPackage) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Package does not exist')({});
  }

  if (existingPackage.guideId !== user.id) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'You cannot delete this package')({});
  }

  return next();
});
export const validatePackagesFetch = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const guideId = req.params.guideId;

  const guideDetails = await fetchGuideDetailsById(guideId);
  if (!guideDetails) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Guide does not exist')({});
  }

  return next();
});
