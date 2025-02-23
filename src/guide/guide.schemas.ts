import Joi from 'joi';

export const FETCH_BY_ID = Joi.object({
  id: Joi.number().required().integer(),
});

export const GUIDE_CERTIFICATION_SCHEMA = Joi.object({
  name: Joi.string().required(),
  issuer: Joi.string().required(),
  issuedDate: Joi.date().iso().required(),
  expiryDate: Joi.date().iso(),
});

export const GUIDE_LANGUAGE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  id: Joi.string().required(),
});

export const GUIDE_EXPERIENCE_SCHEMA = Joi.object({
  title: Joi.string().required(),
  company: Joi.string(),
  location: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso(),
  description: Joi.string().required(),
  expertises: Joi.array().items(Joi.string()),
});

export const GUIDE_UPDATE_DETAILS_SCHEMA = Joi.object({
  bio: Joi.string(),
  tagline: Joi.string(),
  location: Joi.string(),
  dailyRate: Joi.number(),
  expertises: Joi.array().items(Joi.string()),
  languages: Joi.array().items(Joi.string()),
  experiences: Joi.array().items(GUIDE_EXPERIENCE_SCHEMA),
  certifications: Joi.array().items(GUIDE_CERTIFICATION_SCHEMA),
  // username: Joi.string(),
  // fullname: Joi.string(),
});
