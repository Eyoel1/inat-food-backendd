// inat-food-backend/src/controllers/analyticsController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";

/**
 * Dashboard Analytics (Dynamic Period: today, week, month)
 */
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || "today"; // 'today', 'week', 'month'
    const now = new Date();
    let startDate: Date;

    if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay()); // Start of week
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const data = await Order.aggregate([
      {
        $match: {
          status: "Completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "waitress",
          foreignField: "_id",
          as: "waitressInfo",
        },
      },
      { $unwind: { path: "$waitressInfo", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          kpis: [
            {
              $group: {
                _id: null,
                totalSales: { $sum: "$totalPrice" },
                totalOrders: { $addToSet: "$_id" },
              },
            },
          ],
          salesByWaitress: [
            {
              $group: {
                _id: { $ifNull: ["$waitressInfo.name", "Unassigned"] },
                totalSales: { $sum: "$totalPrice" },
              },
            },
          ],
          dailySales: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                totalSales: { $sum: "$totalPrice" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          topItems: [
            { $unwind: "$items" },
            {
              $group: {
                _id: "$items.menuItem",
                name_am: { $first: "$items.name_am" },
                name_en: { $first: "$items.name_en" },
                totalQuantitySold: { $sum: "$items.quantity" },
              },
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 5 },
          ],
          topAddons: [
            { $unwind: "$items" },
            { $unwind: "$items.selectedAddons" },
            {
              $group: {
                _id: "$items.selectedAddons.name_am",
                name_am: { $first: "$items.selectedAddons.name_am" },
                name_en: { $first: "$items.selectedAddons.name_en" },
                totalQuantitySold: { $sum: "$items.quantity" },
              },
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ]);

    const result = {
      totalSales: data[0].kpis[0]?.totalSales || 0,
      totalOrders: data[0].kpis[0]?.totalOrders?.length || 0,
      salesByWaitress: data[0].salesByWaitress.reduce(
        (acc: Record<string, number>, current: any) => {
          acc[current._id] = current.totalSales;
          return acc;
        },
        {}
      ),
      dailySales: data[0].dailySales.map((d: any) => ({
        date: d._id,
        sales: d.totalSales,
      })),
      topSoldItems: data[0].topItems,
      topSoldAddons: data[0].topAddons,
    };

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

/**
 * Item-level Sales Analytics (Top-selling menu items)
 */
export const getItemSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || "today";
    const now = new Date();
    let startDate: Date;

    if (period === "month")
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (period === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const data = await Order.aggregate([
      { $match: { status: "Completed", createdAt: { $gte: startDate } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          name_am: { $first: "$items.name_am" },
          name_en: { $first: "$items.name_en" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
    ]);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

/**
 * Addon-level Sales Analytics (Top-selling addons)
 */
export const getAddonSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || "today";
    const now = new Date();
    let startDate: Date;

    if (period === "month")
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (period === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const data = await Order.aggregate([
      { $match: { status: "Completed", createdAt: { $gte: startDate } } },
      { $unwind: "$items" },
      { $unwind: "$items.selectedAddons" },
      {
        $group: {
          _id: "$items.selectedAddons.name_am",
          name_am: { $first: "$items.selectedAddons.name_am" },
          name_en: { $first: "$items.selectedAddons.name_en" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.selectedAddons.price", "$items.quantity"],
            },
          },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
    ]);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

/**
 * Drill-down: Waitress Sales Details
 */
export const getWaitressSalesDetails = async (req: Request, res: Response) => {
  try {
    const { period, waitressName } = req.query;
    const now = new Date();
    let startDate: Date;

    if (period === "month")
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (period === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const waitress = await User.findOne({ name: waitressName as string });
    if (!waitress)
      return res
        .status(404)
        .json({ status: "fail", message: "Waitress not found." });

    const data = await Order.aggregate([
      {
        $match: {
          waitress: waitress._id,
          status: "Completed",
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          name_am: { $first: "$items.name_am" },
          name_en: { $first: "$items.name_en" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
    ]);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

/**
 * --- DANGER ZONE ---
 * Reset Sales Analytics by deleting all completed orders
 */
export const resetSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const deleteResult = await Order.deleteMany({ status: "Completed" });

    console.log(
      `🚨 Sales Analytics Reset: ${deleteResult.deletedCount} completed orders deleted.`
    );

    res.status(200).json({
      status: "success",
      message: `${deleteResult.deletedCount} completed orders deleted successfully.`,
      data: { deletedCount: deleteResult.deletedCount },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: (error as Error).message });
  }
};
