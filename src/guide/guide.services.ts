import { Prisma } from '@prisma/client';
import prisma from '../db';
import { GuideDetailsUpdateValidatedReqBody } from '../types/guide.types';

export const upsertGuideDetailsById = async (data: Partial<GuideDetailsUpdateValidatedReqBody>, guideId: string) => {
  const updatingDetails: Prisma.GuideUpdateInput = {
    bio: data.bio,
    dailyRate: data.dailyRate,
    expertises: data.expertises,
    tagline: data.tagline,
    languages: data.languages,
    experiences: data.experiences,
    certifications: data.certifications,
    location: data.location,
  };

  const creatingDetails: Prisma.GuideCreateInput = {
    bio: data.bio,
    dailyRate: data.dailyRate,
    expertises: data.expertises,
    tagline: data.tagline,
    languages: data.languages,
    experiences: data.experiences,
    certifications: data.certifications,
    location: data.location,
    user: { connect: { id: guideId } },
  };

  if (data.fullname) {
    const [user, guide] = await prisma.$transaction([
      prisma.user.update({ data: { fullname: data.fullname }, where: { id: guideId } }),
      prisma.guide.upsert({
        where: { id: guideId },
        create: creatingDetails,
        update: updatingDetails,
        include: { user: { select: { fullname: true, username: true, image: true } } },
      }),
    ]);

    return { user, guide };
  } else {
    const guide = await prisma.guide.upsert({
      where: { id: guideId },
      create: creatingDetails,
      update: updatingDetails,
      include: { user: { select: { fullname: true, username: true, image: true } } },
    });

    return { guide };
  }
};

export const fetchExpertiseList = () => {
  return prisma.expertise.findMany();
};
export const fetchLanguagesList = () => {
  return prisma.language.findMany();
};

export const fetchGuideDetailsById = (id: string) => {
  return prisma.user.findFirst({ where: { id }, include: { guide: true } });
};
