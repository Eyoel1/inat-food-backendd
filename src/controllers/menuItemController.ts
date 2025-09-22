// inat-food-backend/src/controllers/menuItemController.ts

import { Request, Response } from "express";
import cloudinary from "cloudinary";
import MenuItem from "../models/menuItemModel";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "./handlerFactory";

// --- Standard CRUD using the Factory ---
export const createMenuItem = createOne(MenuItem);
export const getAllMenuItems = getAll(MenuItem);
export const getMenuItem = getOne(MenuItem);
export const updateMenuItem = updateOne(MenuItem);
export const deleteMenuItem = deleteOne(MenuItem);

// --- Cloudinary Signature (frontend direct upload) ---
/**
 * Generates a secure Cloudinary signature for direct uploads from the frontend.
 * The frontend sends desired upload parameters, and this function signs them
 * without exposing the API secret.
 */
export const getCloudinarySignature = (req: Request, res: Response) => {
  try {
    const paramsToSign = req.body;

    if (!process.env.CLOUDINARY_API_SECRET) {
      console.error("CRITICAL ERROR: Cloudinary API secret not set.");
      throw new Error("Cloudinary API secret is not configured.");
    }

    const signature = cloudinary.v2.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ signature });
  } catch (error) {
    console.error("Error in getCloudinarySignature:", error);
    res.status(500).json({ status: "fail", message: (error as Error).message });
  }
};

// --- Backend Upload (server handles file upload) ---
/**
 * Accepts a base64 image string from the frontend, uploads it to Cloudinary,
 * and returns the secure URL and public_id.
 */
export const uploadMenuItemImage = async (req: Request, res: Response) => {
  try {
    const fileStr = req.body.file;

    if (!fileStr) {
      return res
        .status(400)
        .json({ status: "fail", message: "No image file provided." });
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
      folder: "InatFoodPOS", // Organizes all uploaded images in a folder
      // Optional: you can add transformations, tags, etc.
    });

    res.status(200).json({
      status: "success",
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res
      .status(500)
      .json({
        status: "fail",
        message: "Image upload failed due to a server error.",
      });
  }
};
