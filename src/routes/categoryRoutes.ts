import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// Public route for getting all categories
router.route("/").get(getAllCategories);

// All subsequent routes are protected and restricted to Owner
router.use(protect, restrictTo("Owner"));

router.route("/").post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
