import { Schema, model, Document, Types } from "mongoose";
import * as bcrypt from "bcrypt";

export enum UserRole {
  Owner = "Owner",
  Waitress = "Waitress",
  Kitchen = "Kitchen",
  JuiceBar = "Juice Bar",
}

export interface IUser extends Document {
  _id: Types.ObjectId; // 👈 Explicitly type _id
  name: string;
  username: string;
  pin: string;
  role: UserRole;
  correctPIN(candidatePIN: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide the user's name."],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Please provide a unique username."],
    unique: true,
    trim: true,
    lowercase: true,
  },
  pin: {
    type: String,
    required: [true, "Please provide a 4-digit PIN."],
    minlength: 4,
    maxlength: 4,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.Waitress,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) return next();
  this.pin = await bcrypt.hash(this.pin, 12);
  next();
});

userSchema.methods.correctPIN = async function (
  candidatePIN: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePIN, this.pin);
};

const User = model<IUser>("User", userSchema);
export default User;
