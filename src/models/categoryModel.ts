// src/models/categoryModel.ts

import { Schema, model, Document } from "mongoose";

// Enum to enforce the preparation station
export enum PrepStation {
  Kitchen = "Kitchen",
  JuiceBar = "Juice Bar",
}

// Interface for type-checking
export interface ICategory extends Document {
  name_am: string;
  name_en: string;
  prepStation: PrepStation;
}

const categorySchema = new Schema<ICategory>(
  {
    name_am: {
      type: String,
      required: [true, "Amharic category name is required."],
      unique: true,
      trim: true,
    },
    name_en: {
      type: String,
      required: [true, "English category name is required."],
      unique: true,
      trim: true,
    },
    prepStation: {
      type: String,
      enum: Object.values(PrepStation),
      required: [true, "A category must be assigned to a preparation station."],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Category = model<ICategory>("Category", categorySchema);
export default Category;
