// inat-food-backend/src/routes/menuItemRoutes.ts

import express from "express";
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuItemImage,
} from "../controllers/menuItemController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// --- PUBLIC ROUTES (No token needed) ---
router.get("/", getAllMenuItems);

// --- PROTECTED ROUTES (Owner role required for all below) ---
router.use(protect, restrictTo("Owner"));

// --- SPECIFIC ROUTES FIRST ---
// This is for uploading an image. It is NOT a general "create" route.
router.post("/upload-image", uploadMenuItemImage);

// This is the general "create" route for a new menu item document.
router.post("/", createMenuItem);

// --- GENERAL ROUTES WITH PARAMETERS LAST ---
// This prevents '/:id' from accidentally matching '/upload-image'.
router
  .route("/:id")
  .get(getMenuItem)
  .patch(updateMenuItem)
  .delete(deleteMenuItem);

export default router;
