import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/config';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    // file has been upload successfully
    console.log('File has been upload cloudinary ', response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved file in case of error
  }
};

export { uploadOnCloudinary };
