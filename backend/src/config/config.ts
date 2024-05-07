import { configDotenv } from 'dotenv';

configDotenv();

// "_" this is to tell  that it is a private variable
const _config = {
  PORT: process.env.PORT || 7000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config); // it means it is read only and with freeze we can't do anything with this
