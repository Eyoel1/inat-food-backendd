// inat-food-backend/src/routes/analyticsRoutes.ts

import express from "express";
// --- THE FIX: Add 'getItemSalesAnalytics' to the import list ---
import {
  getDashboardAnalytics,
  getItemSalesAnalytics,
  getWaitressSalesDetails,
  resetSalesAnalytics,
} from "../controllers/analyticsController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// This middleware ensures that only a logged-in Owner can access any analytics route.
router.use(protect, restrictTo("Owner"));

// Route for the main dashboard KPIs (Total Sales, etc.)
router.get("/dashboard", getDashboardAnalytics);

// in analyticsRoutes.ts
router.get("/waitress-details", getWaitressSalesDetails);
// Route for the detailed list of top-selling items
router.get("/item-sales", getItemSalesAnalytics);
router.delete("/reset-sales", resetSalesAnalytics);
export default router;
