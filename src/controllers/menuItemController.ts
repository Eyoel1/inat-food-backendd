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

// --- Server-Side Upload (The Correct Method) ---
export const uploadMenuItemImage = async (req: Request, res: Response) => {
  try {
    const fileStr = req.body.file;
    if (!fileStr) {
      return res
        .status(400)
        .json({ status: "fail", message: "No image file provided." });
    }
    const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
      folder: "InatFoodPOS",
    });
    res.status(200).json({
      status: "success",
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed on backend:", error);
    res
      .status(500)
      .json({ status: "fail", message: "Image upload failed on server." });
  }
};
