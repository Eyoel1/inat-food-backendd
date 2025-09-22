// inat-food-backend/src/routes/menuItemRoutes.ts

import express from "express";
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCloudinarySignature,
} from "../controllers/menuItemController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// --- PUBLIC ROUTES (No token needed) ---
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItem);

// --- PROTECTED ROUTES (Valid token and Owner role required) ---
router.use(protect, restrictTo("Owner"));

// This is the specific route for getting the signature. It must use POST.
router.post("/cloudinary-signature", getCloudinarySignature);

// This route is for creating a new menu item.
router.post("/", createMenuItem);

// These routes are for updating or deleting an existing menu item.
router.patch("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
