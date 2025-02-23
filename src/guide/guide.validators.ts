import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Expertise, Guide } from '@prisma/client';
import { fetchExpertiseList, fetchLanguagesList } from './guide.services';
import { sendFailureRes } from '../utils/formatResponse';
import { StatusCodes } from 'http-status-codes';
import { GuideDetailsUpdateValidatedReqBody } from '../types/guide.types';
import { uniq } from 'lodash';

export const validateDetailsUpdateRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const updatingData = req.body as Guide;

  const verifiedUpdatingData: GuideDetailsUpdateValidatedReqBody = {};

  let expertiseList: Expertise[] | null = null;
  if (updatingData.expertises) {
    expertiseList = await fetchExpertiseList();
    const allowedExpertise = expertiseList?.flatMap((el) => el.expertises);

    for (let i = 0; i < updatingData?.expertises?.length; i++) {
      const value = updatingData.expertises[i];

      if (!allowedExpertise.includes(value)) {
        return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `${value} is not allowed in expertise`)({});
      }
    }
    verifiedUpdatingData.expertises = uniq(updatingData.expertises);
  }
  if (updatingData.languages) {
    const languageList = await fetchLanguagesList();
    const allowedLanguages = languageList.map((el) => el.name);

    for (let i = 0; i < updatingData?.languages?.length; i++) {
      const value = updatingData.languages[i];

      if (!allowedLanguages.includes(value)) {
        return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `${value} is not allowed in expertise`)({});
      }
    }
    verifiedUpdatingData.languages = uniq(updatingData.languages);
  }
  if (updatingData.experiences) {
    if (!expertiseList) {
      expertiseList = await fetchExpertiseList();
    }
    const allowedExpertise = expertiseList?.flatMap((el) => el.expertises);

    for (let i = 0; i < updatingData.experiences.length; i++) {
      const experience = updatingData.experiences[i];

      for (let i = 0; i < experience?.expertises?.length; i++) {
        const value = experience?.expertises[i];

        if (!allowedExpertise.includes(value)) {
          return sendFailureRes(StatusCodes.BAD_REQUEST)(res, `${value} is not allowed in expertise`)({});
        }
      }
    }
    verifiedUpdatingData.experiences = updatingData.experiences;
  }
  if (updatingData.location) {
    verifiedUpdatingData.location = undefined;
  }

  const finalUpdatingData = { ...updatingData, ...verifiedUpdatingData };

  req.body = finalUpdatingData;

  return next();
});
