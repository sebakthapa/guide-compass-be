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
  fullname?: string;

  // username?: string;
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
  fullname?: string;
  // userDetails: {
  //   username?:string;
  // }
}

export type GuideListFetchFilters = Partial<{
  page: number;
  limit: number;
  geoLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  location: {
    country: string;
    state: string;
    county: string;
    city: string;
  };
  address: string;
  expertises: string[];
}>;
