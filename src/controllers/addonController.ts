// inat-food-backend/src/controllers/addonController.ts

import Addon from "../models/addonModel";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "./handlerFactory";

/**
 * Creates a single new add-on.
 */
export const createAddon = createOne(Addon);

/**
 * Retrieves a list of all add-ons.
 */
export const getAllAddons = getAll(Addon);

/**
 * Retrieves a single add-on by its ID.
 */
export const getAddon = getOne(Addon);

/**
 * Updates a single add-on by its ID.
 */
export const updateAddon = updateOne(Addon);

/**
 * Deletes a single add-on by its ID.
 */
export const deleteAddon = deleteOne(Addon);
