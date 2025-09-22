// inat-food-backend/src/utils/cloudinary.ts

import cloudinary from "cloudinary";

/**
 * Configures and initializes the Cloudinary Node.js SDK.
 * It reads the secure credentials directly from the environment variables, which
 * are loaded by the `dotenv.config()` call at the very start of the application.
 */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
