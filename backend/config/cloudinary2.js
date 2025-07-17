// config/cloudinary2.js
import { v2 as cloudinary2 } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("⚠️ Cloudinary2 config LOADED com pasta 'books'");

export default cloudinary2;
