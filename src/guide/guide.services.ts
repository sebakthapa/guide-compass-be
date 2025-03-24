import { Prisma } from '@prisma/client';
import prisma from '../db';
import { GuideDetailsUpdateValidatedReqBody, GuideListFetchFilters } from '../types/guide.types';
import { getCoordinates } from '../utils/geocoding';
import { badRequest } from '@hapi/boom';
import { AnyObject } from '../types';

export const upsertGuideDetailsById = async (data: Partial<GuideDetailsUpdateValidatedReqBody>, guideId: string) => {
  const updatingDetails: Prisma.GuideUpdateInput = {
    bio: data.bio,
    dailyRate: data.dailyRate,
    expertises: data.expertises,
    tagline: data.tagline,
    languages: data.languages,
    experiences: data.experiences,
    certifications: data.certifications,
    // @ts-expect-error sth
    location: data.location,
  };

  const creatingDetails: Prisma.GuideUpsertArgs['create'] = {
    bio: data.bio,
    dailyRate: data.dailyRate,
    expertises: data.expertises,
    tagline: data.tagline,
    languages: data.languages,
    experiences: data.experiences,
    certifications: data.certifications,
    // @ts-expect-error sth
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

export const fetchUserWithGuideDetails = (id: string) => {
  return prisma.user.findFirst({ where: { id }, include: { guide: true } });
};

export const fetchGuideDetailsById = (id: string, includeBannedGuide = false) => {
  return prisma.guide.findFirst({
    where: {
      id,
      user: {
        isBanned: includeBannedGuide ? undefined : false,
      },
    },
    include: { user: { select: { fullname: true, image: true, username: true } }, packages: true },
  });
};

export const fetchGuideListWithPagination = async (filters: GuideListFetchFilters, fetchOnlyBannedGuides = false) => {
  const { expertises, geoLocation, limit = 15, location, page = 1, address } = filters || {};

  // Start with an empty pipeline
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipeline: any[] = [];

  // If location is provided, add geoNear as FIRST stage
  if (location || address || geoLocation) {
    let coordinates;

    if (location || address) {
      coordinates = await getCoordinates(location || address || '');
      if (!coordinates) {
        throw badRequest('Invalid Location');
      }
    } else if (geoLocation) {
      const { latitude, longitude } = geoLocation;
      coordinates = { longitude, latitude };
    }

    if (coordinates) {
      // Add geoNear as the FIRST stage in the pipeline
      pipeline.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude],
          },
          distanceField: 'distance',
          maxDistance: geoLocation ? 20000 + (geoLocation.accuracy || 0) : 20000,
          spherical: true,
          distanceMultiplier: 0.001, // Convert to kilometers
          query: expertises ? { expertises: { $in: expertises } } : {},
        },
      });
    }
  } else {
    // If no location, use regular match
    const fetchFilters: AnyObject = {};
    if (expertises) {
      fetchFilters.expertises = { $in: expertises };
    }
    pipeline.push({ $match: fetchFilters });
  }

  // Add pagination stages
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Add remaining stages for lookup and projection
  pipeline.push({
    $lookup: {
      from: 'User',
      localField: '_id',
      foreignField: '_id',
      as: 'user',
    },
  });

  pipeline.push({
    $project: {
      _id: { $toString: '$_id' },
      user: { $arrayElemAt: ['$user', 0] },
      expertises: 1,
      bio: 1,
      tagline: 1,
      location: 1,
      dailyRate: 1,
      languages: 1,
      experiences: 1,
      certifications: 1,
      verification: 1,
      distance: 1, // Include distance field from geoNear
    },
  });

  pipeline.push({
    $project: {
      _id: 1,
      expertises: 1,
      bio: 1,
      tagline: 1,
      location: 1,
      dailyRate: 1,
      languages: 1,
      experiences: 1,
      certifications: 1,
      verification: 1,
      distance: 1,
      user: {
        name: 1,
        fullname: 1,
        username: 1,
        image: 1,
        isBanned: 1,
      },
    },
  });

  pipeline.push({ $match: { 'user.isBanned': fetchOnlyBannedGuides } });

  pipeline.push({ $sort: { createdAt: -1 } });

  // Wrap the aggregation in a try-catch to handle empty results gracefully
  const guide = (await prisma.guide.aggregateRaw({
    pipeline,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as unknown as any[];

  return guide.map((el) => {
    const { user, ...guideDetails } = el;

    return { ...user, ...guideDetails };
  });
};
