import { CertificationType, GuideExperience, LocationType } from '@prisma/client';

export interface GuideDetailsUpdateReqBody {
  bio?: string;
  tagline?: string;
  location?: string[];
  dailyRate?: number;
  expertises?: string[];
  languages?: string[];
  experiences?: GuideExperience[];
  certifications?: CertificationType[];
  // username?: string;
  // fullname?: string;
}

export interface GuideDetailsUpdateValidatedReqBody {
  bio?: string;
  tagline?: string;
  location?: LocationType;
  dailyRate?: number;
  expertises?: string[];
  languages?: string[];
  experiences?: GuideExperience[];
  certifications?: CertificationType[];
  // userDetails: {
  //   username?:string;
  //   fullname?:string;
  // }
}
