// inat-food-backend/src/routes/userRoutes.ts

import express from "express";
import {
  signup,
  login,
  protect,
  restrictTo,
} from "../controllers/authController";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  getMe, // <-- Import the new controller
} from "../controllers/userController";

const router = express.Router();

// --- PUBLIC ROUTES ---
// These endpoints are open to anyone.
router.post("/signup", signup); // For the very first Owner to create their account.
router.post("/login", login);

// --- PROTECTED ROUTES ---
// The `protect` middleware runs for ALL routes defined below this line.
// This means a valid JWT is required for every subsequent endpoint.
router.use(protect);

// --- NEW ROUTE ---
// For a user to get their OWN profile information (validates their token).
// This is placed BEFORE the '/:id' route to avoid route parameter conflicts.
router.get("/me", getMe);

// --- OWNER-ONLY ADMIN ROUTES ---
// The `restrictTo('Owner')` middleware runs for all routes below this line,
// ensuring only Owners can manage staff.
router.use(restrictTo("Owner"));

// Routes for the entire user collection
router.route("/").get(getAllUsers).post(createUser);

// Routes for a single user, identified by their ID
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
