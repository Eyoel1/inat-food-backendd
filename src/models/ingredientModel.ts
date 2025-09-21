// inat-food-backend/src/models/ingredientModel.ts
import { Schema, model, Document } from "mongoose";

export interface IIngredient extends Document {
  name_am: string;
  name_en: string;
  purchasePrice: number; // e.g., price per kg, per liter, etc.
  purchaseUnit: string; // e.g., 'kg', 'liter', 'piece'
}

const ingredientSchema = new Schema<IIngredient>(
  {
    name_am: { type: String, required: true, unique: true, trim: true },
    name_en: { type: String, required: true, unique: true, trim: true },
    purchasePrice: { type: Number, required: true },
    purchaseUnit: { type: String, required: true },
  },
  { timestamps: true }
);

const Ingredient = model<IIngredient>("Ingredient", ingredientSchema);
export default Ingredient;
