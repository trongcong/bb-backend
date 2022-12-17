import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const SENDGRID = {
  USERNAME: process.env.SENDGRID_USERNAME,
  PASSWORD: process.env.SENDGRID_PASSWORD,
  APIKEY: process.env.SENDGRID_APIKEY,
};
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, BASE_URL } = process.env;
