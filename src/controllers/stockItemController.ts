// inat-food-backend/src/controllers/stockItemController.ts
import StockItem from "../models/stockItemModel";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "./handlerFactory";

export const createStockItem = createOne(StockItem);
export const getAllStockItems = getAll(StockItem);
export const getStockItem = getOne(StockItem);
export const updateStockItem = updateOne(StockItem);
export const deleteStockItem = deleteOne(StockItem);
