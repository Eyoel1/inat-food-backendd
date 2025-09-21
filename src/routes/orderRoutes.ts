// inat-food-backend/src/routes/orderRoutes.ts

import express from "express";
import {
  createOrder,
  getMyActiveOrders,
  updateOrderStatus,
  completeOrderPayment,
  getActiveKdsOrders, // <-- Import the new function
} from "../controllers/orderController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// This middleware is applied to ALL routes in this file.
// Every order-related action requires a user to be logged in.
router.use(protect);

// --- Waitress-Specific Routes ---
router.get("/my-active", restrictTo("Waitress"), getMyActiveOrders);
router.post("/", restrictTo("Waitress"), createOrder);
router.patch("/:id/pay", restrictTo("Waitress"), completeOrderPayment);

// --- Kitchen/Juice Bar-Specific Routes ---
// The new "catch-up" route for when the KDS first loads
router.get(
  "/active-for-kds",
  restrictTo("Kitchen", "Juice Bar"),
  getActiveKdsOrders
);
// The route for updating an order's status (e.g., Pending -> In Progress)
router.patch(
  "/:id/status",
  restrictTo("Kitchen", "Juice Bar"),
  updateOrderStatus
);

export default router;
