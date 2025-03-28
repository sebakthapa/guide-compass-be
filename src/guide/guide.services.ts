import { Prisma, VerificationDocumentType, VerificationStatus } from '@prisma/client';
import prisma from '../db';
import { GuideDetailsUpdateValidatedReqBody, GuideListFetchFilters } from '../types/guide.types';
import { getCoordinates } from '../utils/geocoding';
import { badRequest } from '@hapi/boom';
import { AnyObject } from '../types';
import { File } from 'formidable';
import path from 'path';
import { deleteFromBucket, getPathFromPublicUrl, resolveGcloudDestPath, uploadToBucket } from '../utils/gcloud';

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
    verification: { status: 'PENDING' },
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

export const fetchUserWithGuideDetails = (id: string, includeVerificationDocuments = false) => {
  return prisma.user.findFirst({
    where: { id },
    include: { guide: { include: { verificationDocuments: includeVerificationDocuments, packages: true } } },
  });
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

  pipeline.push({ $match: { 'user.isBanned': fetchOnlyBannedGuides, 'verification.status': 'VERIFIED' } });

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

export const fetchGuideDetailsByVerificationStatus = async (
  verificationStatus: VerificationStatus,
  {
    limit = 10,
    page = 1,
    onlyGuidesHavingAllDetails = false,
  }: {
    page?: number;
    limit?: number;
    onlyGuidesHavingAllDetails?: boolean;
  }
) => {
  const havingAllDetailsWhereFilter = onlyGuidesHavingAllDetails
    ? ({
        bio: { isSet: true },
        certifications: { isSet: true },
        experiences: { isSet: true },
        expertises: { isEmpty: false },
        languages: { isEmpty: false },
        location: { isSet: true },
        tagline: { isSet: true },
      } as Prisma.GuideWhereInput)
    : {};

  const userRes = await prisma.user.findMany({
    where: {
      role: 'GUIDE',
      guide: {
        ...havingAllDetailsWhereFilter,
        verification: { status: verificationStatus },
      },
    },
    include: { guide: true },
    skip: (page - 1) * limit,
    take: limit,
  });

  return userRes?.map((el) => {
    const { guide, ...user } = el;

    return { ...guide, ...user };
  });
};

export const changeGuideVerificationStatus = (guideId: string, status: VerificationStatus, remarks?: string) => {
  return prisma.guide.update({ where: { id: guideId }, data: { verification: { status, remarks } } });
};

export const addGuideDocument = async (guideId: string, document: File, type: VerificationDocumentType) => {
  const imageName = `${guideId}_${document.newFilename}${path.extname(document.originalFilename || '')}`;
  const [file] = await uploadToBucket(document.filepath, {
    destination: resolveGcloudDestPath('guideDocument', imageName),
  });

  const uploadedDocument = await prisma.verificationDocuments.create({
    data: { fileUrl: file.publicUrl(), type, guideId },
  });

  return uploadedDocument;
};

export const removeGuideDocument = async (documentId: string) => {
  const docDetails = await prisma.verificationDocuments.findFirst({ where: { id: documentId } });

  if (!docDetails) {
    return null;
  }

  await deleteFromBucket(getPathFromPublicUrl(docDetails.fileUrl));

  return prisma.verificationDocuments.delete({ where: { id: documentId } });
};
