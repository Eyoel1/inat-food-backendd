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
// Anyone can view the full menu
router.route("/").get(getAllMenuItems);

// --- PROTECTED ROUTES (Valid token and correct role required) ---
// This middleware will apply to all routes defined BELOW it.
router.use(protect, restrictTo("Owner"));

// --- THIS IS THE FIX ---
// Define a specific, separate route for the signature.
// This is now an explicit POST route.
router.post("/cloudinary-signature", getCloudinarySignature);

// Define a route for creating a new menu item
router.route("/").post(createMenuItem);

// Define general routes with a specific ID parameter (:id) LAST.
// This prevents '/:id' from accidentally matching '/cloudinary-signature'.
router
  .route("/:id")
  .get(getMenuItem)
  .patch(updateMenuItem)
  .delete(deleteMenuItem);

export default router;
