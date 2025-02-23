import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import {
  fetchExpertiseList,
  fetchGuideDetailsById,
  fetchLanguagesList,
  upsertGuideDetailsById,
} from './guide.services';
import { GuideDetailsUpdateValidatedReqBody } from '../types/guide.types';

export const guideContUpdateDetails = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as GuideDetailsUpdateValidatedReqBody;
  const user = req.decoded!;

  const newData = await upsertGuideDetailsById(data, user.id);

  return sendSuccessRes(StatusCodes.OK)(res, 'Update Successfull')(newData);
});

export const guideContFetchById = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;

  const data = await fetchGuideDetailsById(user.id);

  if (!data) {
    return sendSuccessRes(StatusCodes.OK)(res, 'Guide details fetched successfully')({});
  }

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide details Fetched Successfully')({ ...data });
});

export const guideContFetchAllLanguages = catchAsync(async (req: Request, res: Response) => {
  const data = await fetchLanguagesList();

  return sendSuccessRes(StatusCodes.OK)(res, 'Languages fetched successfully')(data);
});

export const guideContFetchAllExpertise = catchAsync(async (req: Request, res: Response) => {
  const data = await fetchExpertiseList();

  return sendSuccessRes(StatusCodes.OK)(res, 'Expertise fetched successfully')(data);
});
