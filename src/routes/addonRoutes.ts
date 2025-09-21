// inat-food-backend/src/routes/addonRoutes.ts

import express from "express";
import {
  createAddon,
  getAllAddons,
  getAddon,
  updateAddon,
  deleteAddon,
} from "../controllers/addonController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

// This middleware protects ALL routes in this file. Only an 'Owner'
// can create, read, update, or delete from the master add-on list.
router.use(protect, restrictTo("Owner"));

// Routes for the entire collection (GET all, POST a new one)
router.route("/").get(getAllAddons).post(createAddon);

// Routes for a single document identified by ID
router.route("/:id").get(getAddon).patch(updateAddon).delete(deleteAddon);

export default router;
