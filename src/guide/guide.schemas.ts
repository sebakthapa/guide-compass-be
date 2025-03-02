import Joi from 'joi';
import { PAGINATION_SCHEMA } from '../config/schema.constants';

export const FETCH_BY_ID = Joi.object({
  id: Joi.number().required().integer(),
});

export const GUIDE_CERTIFICATION_SCHEMA = Joi.object({
  name: Joi.string().required(),
  issuer: Joi.string().required(),
  issuedDate: Joi.date().iso().required(),
  expiryDate: Joi.date().iso().allow(null),
});

export const GUIDE_EXPERIENCE_SCHEMA = Joi.object({
  title: Joi.string().required(),
  company: Joi.string().allow(null),
  location: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().allow(null),
  description: Joi.string().required(),
  expertises: Joi.array().items(Joi.string()).allow(null),
});

export const GUIDE_LOCATION_SCHEMA = Joi.object({
  country: Joi.string().required(),
  state: Joi.string().required(),
  county: Joi.string().required(),
  city: Joi.string().required(),
});

export const GUIDE_LOCATION_OPTIONAL_SCHEMA = GUIDE_LOCATION_SCHEMA.fork(
  ['country', 'state', 'county', 'city'],
  (schema) => schema.optional()
);

export const GUIDE_UPDATE_DETAILS_SCHEMA = Joi.object({
  bio: Joi.string(),
  tagline: Joi.string(),
  location: GUIDE_LOCATION_SCHEMA,
  dailyRate: Joi.number(),
  expertises: Joi.array().items(Joi.string()).max(6),
  languages: Joi.array().items(Joi.string()).max(6),
  experiences: Joi.array().items(GUIDE_EXPERIENCE_SCHEMA).max(5),
  certifications: Joi.array().items(GUIDE_CERTIFICATION_SCHEMA).max(5),
  fullname: Joi.string(),
  // username: Joi.string(),
});

const GEOLOCATION_SCHEMA = {
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  accuracy: Joi.number(),
};

export const GUIDE_LIST_FETCH_SCHEMA = Joi.object({
  location: GUIDE_LOCATION_OPTIONAL_SCHEMA,
  address: Joi.string(),
  expertises: Joi.array().items(Joi.string()).max(5),
  geoLocation: GEOLOCATION_SCHEMA,
})
  .concat(PAGINATION_SCHEMA)
  .oxor('address', 'geoLocation', 'location');
