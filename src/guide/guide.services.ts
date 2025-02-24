import prisma from '../db';
import { GuideDetailsUpdateValidatedReqBody } from '../types/guide.types';

export const upsertGuideDetailsById = async (data: Partial<GuideDetailsUpdateValidatedReqBody>, guideId: string) => {
  const updatingDetails: GuideDetailsUpdateValidatedReqBody = {
    bio: data.bio,
    dailyRate: data.dailyRate,
    expertises: data.expertises,
    tagline: data.tagline,
    languages: data.languages,
    experiences: data.experiences,
    certifications: data.certifications,
    location: data.location,
  };

  const updatedGuide = await prisma.guide.upsert({
    where: { id: guideId },
    create: {
      id: guideId,
      ...updatingDetails,
      verification: { status: 'PENDING' },
    },
    update: updatingDetails,
  });

  return updatedGuide;
};

export const fetchExpertiseList = () => {
  return prisma.expertise.findMany();
};
export const fetchLanguagesList = () => {
  return prisma.language.findMany();
};

export const fetchGuideDetailsById = (id: string) => {
  return prisma.guide.findFirst({ where: { id } });
};
