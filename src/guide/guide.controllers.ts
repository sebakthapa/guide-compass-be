import { Request, Response } from 'express';
import { catchAsync, catchAsyncFile } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { AddGuideDocumentBody, GuideDetailsUpdateValidatedReqBody, GuideListFetchFilters } from '../types/guide.types';
import * as services from './guide.services';
import { changeUserRole } from '../users/users.services';
import { File } from 'formidable';
import { GUIDE_DOCUMENT_TYPES } from './guide.config';

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

  const fetchedUser = await services.fetchUserWithGuideDetails(user.id, true);

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

// export const guideContRequestProfileReview = catchAsync(async(req:Request, res:Response) => {

//   await changeGuideVerificationStatus

//   return sendSuccessRes(StatusCodes.OK)(res, 'Profile sent for review')({})
// })

export const guideContAddGuideDocument = catchAsyncFile(async (req: Request, res: Response) => {
  // @ts-ignore
  const document = req.document?.[0] as File | null;
  const { type } = req.body as AddGuideDocumentBody;
  const user = req.decoded!;

  if (!document) {
    return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'document is required')({});
  }

  const uploadedData = await services.addGuideDocument(user.id, document, type);

  return sendSuccessRes(StatusCodes.OK)(res, 'Document Added')(uploadedData);
});

export const guideContremoveGuideDocument = catchAsyncFile(async (req: Request, res: Response) => {
  const id = req.params.id as unknown as string;

  const deletedDoc = await services.removeGuideDocument(id);

  return sendSuccessRes(StatusCodes.OK)(res, 'Document Deleted')(deletedDoc || {});
});

export const guideContFetchAvailableDocuments = catchAsyncFile((req: Request, res: Response) => {
  return sendSuccessRes(StatusCodes.OK)(res, 'Fetched')(GUIDE_DOCUMENT_TYPES);
});
