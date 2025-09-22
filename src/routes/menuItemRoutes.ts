// inat-food-backend/src/routes/menuItemRoutes.ts

import express from "express";
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuItemImage, // <-- Import the new upload controller
} from "../controllers/menuItemController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// --- PUBLIC ROUTES (No token needed) ---
// Anyone (e.g., a waitress) can view the list of menu items or a single item.
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItem);

// --- PROTECTED ROUTES (Valid token and 'Owner' role required) ---
// The middleware below applies to all subsequent routes in this file.
router.use(protect, restrictTo("Owner"));

// --- NEW ROUTE for server-side upload ---
// The owner must be logged in to upload an image.
router.post("/upload-image", uploadMenuItemImage);

// This route is for creating the menu item document AFTER the image is uploaded.
router.post("/", createMenuItem);

// These routes are for updating or deleting an existing menu item.
router.patch("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
