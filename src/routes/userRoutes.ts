// inat-food-backend/src/routes/userRoutes.ts
import express from "express";
import { signup, login } from "../controllers/authController";
// Import the new user controller functions
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// --- Public Routes ---
router.post("/signup", signup); // This remains public for initial owner setup
router.post("/login", login);

// --- Protected Routes for Owner Management ---
// All routes from here on require the user to be a logged-in Owner.
router.use(protect, restrictTo("Owner"));

router.route("/").get(getAllUsers).post(createUser); // Owner can create new staff

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
