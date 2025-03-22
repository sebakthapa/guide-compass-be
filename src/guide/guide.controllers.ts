import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { GuideDetailsUpdateValidatedReqBody, GuideListFetchFilters } from '../types/guide.types';
import * as services from './guide.services';
import { changeUserRole } from '../users/users.services';

export const guideContUpdateDetails = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as GuideDetailsUpdateValidatedReqBody;
  const user = req.decoded!;

  const { guide, user: updatedUser } = await services.upsertGuideDetailsById(data, user.id);

  const { user: guideUser, ...guideOnly } = guide;

  const finalUser = updatedUser || guideUser;

  const { username, fullname, image } = finalUser;

  return sendSuccessRes(StatusCodes.OK)(res, 'Update Successfull')({ ...{ username, fullname, image }, ...guideOnly });
});

export const guideContFetchSelfDetails = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;

  const fetchedUser = await services.fetchUserWithGuideDetails(user.id);

  if (!fetchedUser) {
    return sendSuccessRes(StatusCodes.OK)(res, 'Guide details fetched successfully')({});
  }

  const { guide, fullname, image, username } = fetchedUser;

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide details Fetched Successfully')({
    fullname,
    image,
    username,
    ...guide,
  });
});

export const guideContFetchAllLanguages = catchAsync(async (req: Request, res: Response) => {
  const data = await services.fetchLanguagesList();

  return sendSuccessRes(StatusCodes.OK)(res, 'Languages fetched successfully')(data);
});

export const guideContFetchAllExpertise = catchAsync(async (req: Request, res: Response) => {
  const data = await services.fetchExpertiseList();

  return sendSuccessRes(StatusCodes.OK)(res, 'Expertise fetched successfully')(data);
});

export const guideContFetchGuidesList = catchAsync(async (req: Request, res: Response) => {
  const filters = req.body as GuideListFetchFilters;

  const data = await services.fetchGuideListWithPagination(filters);

  return sendSuccessRes(StatusCodes.OK)(res, 'Details fetched successfully')(data);
});

export const guideContFetchGuideDetailsById = catchAsync(async (req: Request, res: Response) => {
  const { guideId } = req.params;
  const fetcingUser = req.decoded;

  const details = await services.fetchGuideDetailsById(guideId, fetcingUser?.role === 'ADMIN');

  if (!details) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Guide does not exist')({});
  }

  const { user, ...guideDetails } = details;

  const formattedDetails = { ...user, ...guideDetails };

  return sendSuccessRes(StatusCodes.OK)(res, 'Guide details fetched successfully')(formattedDetails);
});

export const guideContBecomeGuide = catchAsync(async (req: Request, res: Response) => {
  const user = req.decoded!;

  const data = await changeUserRole(user.id, 'GUIDE');
  await services.upsertGuideDetailsById({}, user.id);
  const { password: _, ...detailsWithoutPassword } = data;

  return sendSuccessRes(StatusCodes.OK)(res, 'Became guide')(detailsWithoutPassword);
});
