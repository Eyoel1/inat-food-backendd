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

// --- PUBLIC ROUTES ---
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItem);

// --- PROTECTED ROUTES (OWNER ONLY) ---
router.use(protect, restrictTo("Owner"));

// SPECIFIC 'POST' ROUTE FOR IMAGE UPLOADS
router.post("/upload-image", uploadMenuItemImage);

// GENERAL 'POST' ROUTE FOR CREATING THE DOCUMENT
router.post("/", createMenuItem);

// GENERAL ROUTES WITH PARAMETERS FOR UPDATING/DELETING
router.patch("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
