// inat-food-backend/src/routes/stockItemRoutes.ts
import express from "express";
import {
  createStockItem,
  getAllStockItems,
  getStockItem,
  updateStockItem,
  deleteStockItem,
} from "../controllers/stockItemController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// All stock routes are protected and for the Owner only.
router.use(protect, restrictTo("Owner"));

router.route("/").get(getAllStockItems).post(createStockItem);
router
  .route("/:id")
  .get(getStockItem)
  .patch(updateStockItem)
  .delete(deleteStockItem);

export default router;
