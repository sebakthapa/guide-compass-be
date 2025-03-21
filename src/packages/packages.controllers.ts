import { Request, Response } from 'express';
import { catchAsync, catchAsyncFile } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import * as services from './packages.services';
import { File } from 'formidable';

export const packagesContCreatePackage = catchAsyncFile(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.decoded!;

  // @ts-expect-error sth
  const image = req.image?.[0] as File;

  const uploadedFile = await services.uploadPackageImage(image, user.id);
  const createdData = await services.createPackage(user.id, data, uploadedFile.publicUrl());

  return sendSuccessRes(StatusCodes.OK)(res, 'Package Created successfully')(createdData);
});

export const packagesContFetchGuidePackages = catchAsync(async (req: Request, res: Response) => {
  const guideId = req.params.guideId;
  const fetchedData = await services.fetchGuidePackages(guideId);

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide packages fetched successfully')(fetchedData);
});

export const packagesContEditGuidePackage = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const { packageId } = req.params;
  const user = req.decoded!;

  // @ts-expect-error sth
  const image = req.image?.[0] as File;

  let newImageUrl = '';
  if (image) {
    // TODO: delete previous image
    const uploadedFile = await services.uploadPackageImage(image, user.id);
    newImageUrl = uploadedFile.publicUrl();
  }
  const updatedData = await services.updatePackage(packageId, { ...data, image: newImageUrl || undefined });

  return sendSuccessRes(StatusCodes.OK)(res, 'Package edited successfully')(updatedData);
});
