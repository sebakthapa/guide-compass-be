import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'node:path';
import { EnvVars } from './types/env';

dotenv.config({ path: path.join(__dirname, '../.env') });

// Env Validation
const envObject: Record<keyof EnvVars, Joi.Schema> = {
  // Application
  APP_NAME: Joi.string().required(),
  APP_VERSION: Joi.string().required(),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),

  // Logs
  LOG_DIR: Joi.string().required(),
  LOG_LEVEL: Joi.string().required(),

  // Directories
  ROOT_PATH: Joi.string().required(),
  PUBLIC_PATH: Joi.string().required(),
  TEMP_DIR: Joi.string().required(),

  // Database
  DATABASE_URL: Joi.string().required(),

  // SMTP
  SMTP_HOST: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_PORT: Joi.string().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_IS_SECURE: Joi.string().required().valid('true', 'false'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  TOKEN_EXPIRES: Joi.string().required(),

  // ENCRYPTION
  ENCRYPTION_SECRET: Joi.string().required(),

  // PAYMENT
  ESEWA_SECRET: Joi.string().required(),
};
const envVarsSchema = Joi.object(envObject).unknown();

const { error, value: env }: { error: Joi.ValidationError | undefined; value: EnvVars } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Enviornment Variables Validation Error: ${error.message}`);
}

export default env;
