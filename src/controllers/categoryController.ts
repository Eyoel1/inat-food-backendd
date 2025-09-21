import Category from "../models/categoryModel";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "./handlerFactory";

// Use the factory to generate all CRUD functions
export const createCategory = createOne(Category);
export const getAllCategories = getAll(Category);
export const getCategory = getOne(Category);
export const updateCategory = updateOne(Category);
export const deleteCategory = deleteOne(Category);
