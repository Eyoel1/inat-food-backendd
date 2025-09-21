// inat-food-backend/src/controllers/ingredientController.ts

import Ingredient from "../models/ingredientModel";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "./handlerFactory";

/**
 * Creates a single new ingredient in the database.
 * This is an alias for the generic `createOne` factory function,
 * passed the `Ingredient` model.
 */
export const createIngredient = createOne(Ingredient);

/**
 * Retrieves a list of all ingredients from the database.
 * This is an alias for the generic `getAll` factory function.
 */
export const getAllIngredients = getAll(Ingredient);

/**
 * Retrieves a single ingredient by its ID.
 * This is an alias for the generic `getOne` factory function.
 */
export const getIngredient = getOne(Ingredient);

/**
 * Updates a single ingredient by its ID.
 * This is an alias for the generic `updateOne` factory function.
 */
export const updateIngredient = updateOne(Ingredient);

/**
 * Deletes a single ingredient by its ID.
 * This is an alias for the generic `deleteOne` factory function.
 */
export const deleteIngredient = deleteOne(Ingredient);
