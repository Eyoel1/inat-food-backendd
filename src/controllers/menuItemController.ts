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

// --- NEW, DEBUGGABLE Server-Side Upload Method ---
export const uploadMenuItemImage = async (req: Request, res: Response) => {
  try {
    const fileStr = req.body.file;

    // --- 1. CRITICAL LOGGING ---
    console.log("\n\n--- Received Image Upload Request ---");
    if (fileStr) {
      console.log("File string received. Type:", typeof fileStr);
      // Log the first 60 characters to confirm it's a valid data URI
      console.log("File string start:", fileStr.substring(0, 60) + "...");
    } else {
      console.log("!!! NO FILE STRING RECEIVED !!!");
    }

    if (!fileStr || typeof fileStr !== "string") {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "No valid image file data provided.",
        });
    }

    // Use the Cloudinary SDK uploader
    const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
      folder: "InatFoodPOS",
    });

    console.log(
      "✅ Cloudinary upload successful. URL:",
      uploadResponse.secure_url
    );

    res.status(200).json({
      status: "success",
      url: uploadResponse.secure_url,
    });
  } catch (error: any) {
    // --- 2. CRITICAL LOGGING for the error ---
    console.error("\n\n❌❌❌ CLOUDINARY UPLOAD FAILED ON BACKEND ❌❌❌");
    // Cloudinary errors are often nested. This will print the detailed reason.
    console.error(JSON.stringify(error, null, 2));
    console.error("------------------------------------\n\n");

    // Send a more descriptive error back to the frontend
    const errorMessage =
      error.message || "Image upload failed due to a server error.";
    res.status(500).json({ status: "fail", message: errorMessage });
  }
};
