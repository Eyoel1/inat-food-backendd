// inat-food-backend/src/models/orderModel.ts
import { Schema, model, Document, Types } from "mongoose";

export enum OrderStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Ready = "Ready",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum PaymentMethod {
  Cash = "Cash",
  Card = "Card/Transfer",
  Mobile = "Mobile Money",
  Mixed = "Mixed",
}

export interface IOrderItem {
  menuItem: Types.ObjectId;
  name_en?: string;
  name_am: string;
  quantity: number;
  price: number; // base price only
  selectedAddons: {
    name_en?: string;
    name_am: string;
    price: number;
  }[];
}

export interface IOrder extends Document {
  orderNumber: number;
  waitress: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  prepStation: string;
  paymentMethod?: PaymentMethod;
  amountPaid?: number;
  tip?: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: Number, required: true, unique: true },
    waitress: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        _id: false,
        menuItem: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name_en: { type: String },
        name_am: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        selectedAddons: [
          {
            _id: false,
            name_en: { type: String },
            name_am: { type: String, required: true },
            price: { type: Number, required: true },
          },
        ],
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
    },
    prepStation: { type: String, required: true },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod) },
    amountPaid: { type: Number },
    tip: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
