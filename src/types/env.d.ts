export type EnvVars = {
  // Application
  APP_NAME: string;
  APP_VERSION: string;
  APP_PORT: string;
  APP_HOST: string;
  NODE_ENV: 'development' | 'production' | 'test';

  // LOG
  LOG_DIR: string;
  LOG_LEVEL: string;

  // Dirs
  PUBLIC_PATH: string;
  ROOT_PATH: string;
  TEMP_DIR: string;

  // Database
  DATABASE_URL: string;

  // SMTP
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_IS_SECURE: string;

  // JWT
  JWT_SECRET: string;
  TOKEN_EXPIRES: string;

  // ENCRYPTION
  ENCRYPTION_SECRET: string;

  // PAYMENT
  ESEWA_SECRET: string;
};

declare namespace NodeJS {
  interface ProcessEnv extends Partial<EnvVars> {}
}
