// inat-food-backend/src/models/stockItemModel.ts
import { Schema, model, Document } from "mongoose";

export interface IStockItem extends Document {
  name_am: string;
  name_en: string;
  quantity: number;
  unit_am: string; // e.g., 'ጠርሙስ', 'ኪሎ'
  unit_en: string; // e.g., 'Bottle', 'kg'
  lowStockThreshold: number;
}

const stockItemSchema = new Schema<IStockItem>(
  {
    name_am: { type: String, required: true, unique: true, trim: true },
    name_en: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, default: 0 },
    unit_am: { type: String, required: true },
    unit_en: { type: String, required: true },
    lowStockThreshold: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const StockItem = model<IStockItem>("StockItem", stockItemSchema);
export default StockItem;
