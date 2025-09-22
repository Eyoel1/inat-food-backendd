// inat-food-backend/src/utils/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";

// --- THIS IS THE KEY CHANGE ---
// Instead of configuring on import, we export a function
// that we can call at the correct time.
export const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured successfully.");
};

// We export the configured cloudinary instance for use in our controllers
export default cloudinary;
