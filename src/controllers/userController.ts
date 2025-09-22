// inat-food-backend/src/controllers/userController.ts

import { Request, Response } from "express";
import User from "../models/userModel";
import { createOne, getAll, getOne, deleteOne } from "./handlerFactory";

/**
 * --- NEW FUNCTION ---
 * Retrieves the profile of the currently logged-in user.
 * This is a highly secure and efficient way to validate a token and get fresh user data.
 * The `protect` middleware runs before this function, so it has already:
 *   1. Verified the JWT is valid.
 *   2. Found the user in the database.
 *   3. Attached the user object to `req.user`.
 * All this function needs to do is send back the user data that the middleware prepared.
 */
export const getMe = (req: Request, res: Response) => {
  // If the middleware passed, req.user is guaranteed to be present.
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

/**
 * Creates a new user (staff member). Used by the Owner.
 */
export const createUser = createOne(User);

/**
 * Gets a list of all users. Used by the Owner.
 */
export const getAllUsers = getAll(User);

/**
 * Gets a single user by their ID. Used by the Owner.
 */
export const getUser = getOne(User);

/**
 * Deletes a user by their ID. Used by the Owner.
 */
export const deleteUser = deleteOne(User);

/**
 * Updates a user's data (e.g., name, role, username).
 * This function is specialized to PREVENT the PIN from being changed.
 * Changing a PIN/password should have its own dedicated, secure controller.
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const filteredBody = { ...req.body };
    const disallowedFields = ["pin", "password"];
    disallowedFields.forEach((field) => delete filteredBody[field]);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "No user found with that ID" });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};
