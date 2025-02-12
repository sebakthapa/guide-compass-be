import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import env from '../env';
dotenv.config();

export const transportConfig = {
  host: env.SMTP_HOST!,
  port: parseInt(env.SMTP_PORT!),
  secure: JSON.parse(env.SMTP_IS_SECURE!.toLowerCase()),
  auth: {
    user: env.SMTP_USER!,
    pass: env.SMTP_PASS!,
  },
};

export const mailTransporter = nodemailer.createTransport(transportConfig);
