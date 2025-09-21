// inat-food-backend/src/models/menuItemModel.ts

import { Schema, model, Document, Types, Query } from "mongoose";
import { ICategory } from "./categoryModel";
import { IIngredient } from "./ingredientModel";
import { IAddon } from "./addonModel"; // Import the Addon interface

interface IRecipeItem {
  ingredient: Types.ObjectId | IIngredient;
  quantity: number;
  unit: string;
}

export interface IMenuItem extends Document {
  name_am: string;
  name_en: string;
  price: number;
  category: Types.ObjectId | ICategory;
  image: string;
  isAvailable: boolean;
  isFasting: boolean;
  recipe: IRecipeItem[];
  availableAddons: Types.ObjectId[] | IAddon[]; // Can be an array of IDs or populated Addon objects
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name_am: { type: String, required: true, unique: true, trim: true },
    name_en: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    isFasting: { type: Boolean, default: false },
    recipe: [
      {
        _id: false,
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    // The schema to store an array of references to Addon documents
    availableAddons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Addon",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * --- THIS IS THE DEFINITIVE FIX ---
 * This middleware runs before any 'find' query. It now populates BOTH the 'category'
 * AND the 'availableAddons' fields. This is what was missing. It ensures that
 * whenever the frontend fetches menu items, the `availableAddons` array will be
 * filled with the full addon documents (name, price, etc.) instead of just their IDs.
 */
menuItemSchema.pre<Query<IMenuItem, IMenuItem>>(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name_am name_en prepStation",
  }).populate({
    path: "availableAddons",
    select: "name_am name_en price", // Select the fields we need from the addons
  });
  next();
});

const MenuItem = model<IMenuItem>("MenuItem", menuItemSchema);

export default MenuItem;
