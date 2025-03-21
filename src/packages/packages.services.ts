import { Prisma } from '@prisma/client';
import prisma from '../db';
import { uploadToBucket } from '../utils/gcloud';
import { PACKAGE_IMAGE_FOLDER } from './packages.configs';
import { File } from 'formidable';
import path from 'path';

export const createPackage = (
  guideId: string,
  creatingData: Omit<Prisma.PackageCreateInput, 'guide' | 'image'>,
  imageUrl: string
) => {
  return prisma.package.create({
    data: { ...creatingData, guideId, duration: +creatingData.duration, image: imageUrl },
  });
};
export const updatePackage = (packageId: string, updatingData: Prisma.PackageUpdateInput) => {
  return prisma.package.update({
    data: { ...updatingData },
    where: { id: packageId },
  });
};

export const fetchGuidePackages = (guideId: string) => {
  return prisma.package.findMany({ where: { guideId } });
};

export const fetchGuidePackageByPackageId = (packageId: string) => {
  return prisma.package.findFirst({ where: { id: packageId } });
};

export const doesPackageAlreadyExist = async (guideId: string, location: string, name: string, packageId?: string) => {
  const res = await prisma.package.findFirst({
    where: {
      guideId,
      OR: [{ location }, { name }],
      NOT: [{ id: packageId }],
    },
  });

  if (!res) {
    return false;
  }

  if (location === res.location) {
    return 'location';
  } else {
    return 'name';
  }
};

export const uploadPackageImage = async (image: File, anyId: string) => {
  const destImageName = `${PACKAGE_IMAGE_FOLDER}/${anyId}_${image.newFilename}${path.extname(image.originalFilename || '')}`;

  const [file] = await uploadToBucket(image.filepath, {
    destination: destImageName,
  });

  return file;
};
