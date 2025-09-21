// inat-food-backend/src/controllers/orderController.ts

import { Request, Response } from "express";
import Order, { IOrder, OrderStatus } from "../models/orderModel";
import Sequence from "../models/sequenceModel";
import { getIO } from "../socket";
import { IUser } from "../models/userModel";

async function getNextOrderNumber(sequenceName: string): Promise<number> {
  const sequenceDocument = await Sequence.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalPrice, prepStation } = req.body;
    if (!req.user)
      return res
        .status(401)
        .json({ status: "fail", message: "User not logged in." });

    const newOrder = new Order({
      orderNumber: await getNextOrderNumber("orderNumber"),
      waitress: req.user._id,
      items,
      totalPrice,
      prepStation,
      status: OrderStatus.Pending,
    });
    await newOrder.save();
    const populatedOrder = await newOrder.populate("waitress", "name");

    const io = getIO();
    console.log(
      `\n📢 Broadcasting 'new_order' to room: ---> ${prepStation} <---`
    );
    io.to(prepStation).emit("new_order", populatedOrder);
    res.status(201).json({ status: "success", data: { data: populatedOrder } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

export const getMyActiveOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ status: "fail", message: "User not logged in." });

    const orders = await Order.find({
      waitress: req.user._id,
      status: {
        $in: [OrderStatus.Pending, OrderStatus.InProgress, OrderStatus.Ready],
      },
    }).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: orders.length,
      data: { data: orders },
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

/**
 * --- DEFINITIVE FIX ---
 * Updates an order's status using the safe "find and save" pattern.
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    // Step 1: Find the document. `findById` returns a clearly typed `IOrder | null`.
    const order = await Order.findById(req.params.id);

    // Step 2: A definitive type guard.
    if (!order) {
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found." });
    }

    // Step 3: Modify the document and save it.
    order.status = status;
    const updatedOrder = await order.save(); // The return type of .save() is also clearly typed.

    // `updatedOrder._id` is now guaranteed to be safe to access.
    const io = getIO();
    io.emit("order_status_updated", {
      orderId: updatedOrder.id.toString(),
      newStatus: updatedOrder.status,
      waitressId: updatedOrder.waitress.toString(),
    });

    res.status(200).json({ status: "success", data: { data: updatedOrder } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

/**
 * Completes an order with payment details, also using the "find and save" pattern.
 */
export const completeOrderPayment = async (req: Request, res: Response) => {
  try {
    const { paymentMethod, amountPaid, tip } = req.body;

    // Step 1: Find
    const order = await Order.findById(req.params.id);

    // Step 2: Guard
    if (!order) {
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    }

    // Step 3: Modify and Save
    order.paymentMethod = paymentMethod;
    order.amountPaid = amountPaid;
    order.tip = tip;
    order.status = OrderStatus.Completed;
    const updatedOrder = await order.save();

    res.status(200).json({ status: "success", data: { data: updatedOrder } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

export const getActiveKdsOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ status: "fail", message: "User not logged in." });

    const prepStation = req.user.role;
    const orders = await Order.find({
      prepStation: prepStation,
      status: { $in: [OrderStatus.Pending, OrderStatus.InProgress] },
    })
      .sort({ createdAt: 1 })
      .populate("waitress", "name");

    res.status(200).json({ status: "success", data: { data: orders } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};
