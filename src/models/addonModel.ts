// inat-food-backend/src/models/addonModel.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IAddon extends Document {
  name_am: string;
  name_en: string;
  price: number;
  // Optional link to an ingredient/stock item for inventory deduction
  linkedIngredient?: Types.ObjectId;
}

const addonSchema = new Schema<IAddon>(
  {
    name_am: { type: String, required: true, trim: true },
    name_en: { type: String, required: true, trim: true, unique: true },
    price: { type: Number, required: true, default: 0 },
    linkedIngredient: {
      type: Schema.Types.ObjectId,
      ref: "Ingredient", // Can be linked to a raw ingredient
    },
  },
  { timestamps: true }
);

const Addon = model<IAddon>("Addon", addonSchema);
export default Addon;
