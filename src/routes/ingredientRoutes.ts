// inat-food-backend/src/routes/ingredientRoutes.ts

import express from "express";
import {
  createIngredient,
  getAllIngredients,
  getIngredient,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredientController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// --- SECURE ALL ROUTES ---
// This middleware is applied to every single route defined in this file.
// It will first check for a valid JWT (protect), and then it will verify
// that the user's role is 'Owner' (restrictTo).
router.use(protect, restrictTo("Owner"));

// --- DEFINE ROUTES ---

// Routes for the entire collection:
// GET /api/v1/ingredients -> Get a list of all ingredients.
// POST /api/v1/ingredients -> Create a new ingredient.
router.route("/").get(getAllIngredients).post(createIngredient);

// Routes for a single document, identified by its ID:
// GET /api/v1/ingredients/:id -> Get a single ingredient.
// PATCH /api/v1/ingredients/:id -> Update an ingredient.
// DELETE /api/v1/ingredients/:id -> Delete an ingredient.
router
  .route("/:id")
  .get(getIngredient)
  .patch(updateIngredient)
  .delete(deleteIngredient);

export default router;
