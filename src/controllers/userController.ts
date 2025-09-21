// inat-food-backend/src/controllers/userController.ts

import { Request, Response } from "express";
import User from "../models/userModel";
import { createOne, getAll, getOne, deleteOne } from "./handlerFactory";

/**
 * Creates a new user (staff member). This is an alias for the factory function.
 * It's used by the Owner to add new staff members. The `signup` function in
 * `authController` can be seen as a special version of this for initial setup.
 */
export const createUser = createOne(User);

/**
 * Gets a list of all users.
 */
export const getAllUsers = getAll(User);

/**
 * Gets a single user by their ID.
 */
export const getUser = getOne(User);

/**
 * Deletes a user by their ID.
 */
export const deleteUser = deleteOne(User);

/**
 * Updates a user's data.
 * This is a specialized function, NOT from the factory, to provide an extra layer
 * of security. It explicitly prevents the 'pin' or 'password' fields from being
 * updated through this generic endpoint. A dedicated "changePin" controller would
 * be required for that, which would involve extra security checks (e.g., confirming old pin).
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    // 1. Create a shallow copy of the request body.
    const filteredBody = { ...req.body };

    // 2. Define an array of fields that should NOT be updated via this function.
    const disallowedFields = ["pin", "password"];

    // 3. Remove any disallowed fields from the filteredBody object.
    disallowedFields.forEach((field) => delete filteredBody[field]);

    // 4. Find the user by the ID from the URL parameters and update it with the safe, filtered data.
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true, // Return the newly updated document instead of the old one
        runValidators: true, // Ensure any schema validations (e.g., `enum` for roles) are run
      }
    );

    // 5. If no user was found with that ID, send a 404 error.
    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "No user found with that ID" });
    }

    // 6. Send a success response with the updated user data.
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    // Handle any potential errors (e.g., validation errors)
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};
