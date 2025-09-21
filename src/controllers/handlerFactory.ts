// src/controllers/handlerFactory.ts
import { Model, Document } from "mongoose";
import { Request, Response } from "express";

export const deleteOne =
  <T extends Document>(Model: Model<T>) =>
  async (req: Request, res: Response) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return res
          .status(404)
          .json({ status: "fail", message: "No document found with that ID" });
      }

      res.status(204).json({ status: "success", data: null });
    } catch (error) {
      res
        .status(400)
        .json({ status: "fail", message: (error as Error).message });
    }
  };

export const updateOne =
  <T extends Document>(Model: Model<T>) =>
  async (req: Request, res: Response) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the new, updated document
        runValidators: true, // Run schema validators on update
      });

      if (!doc) {
        return res
          .status(404)
          .json({ status: "fail", message: "No document found with that ID" });
      }

      res.status(200).json({ status: "success", data: { data: doc } });
    } catch (error) {
      res
        .status(400)
        .json({ status: "fail", message: (error as Error).message });
    }
  };

export const getOne =
  <T extends Document>(Model: Model<T>) =>
  async (req: Request, res: Response) => {
    try {
      const doc = await Model.findById(req.params.id);

      if (!doc) {
        return res
          .status(404)
          .json({ status: "fail", message: "No document found with that ID" });
      }

      res.status(200).json({ status: "success", data: { data: doc } });
    } catch (error) {
      res
        .status(400)
        .json({ status: "fail", message: (error as Error).message });
    }
  };

export const createOne =
  <T>(Model: Model<T>) =>
  async (req: Request, res: Response) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({ status: "success", data: { data: doc } });
    } catch (error) {
      res
        .status(400)
        .json({ status: "fail", message: (error as Error).message });
    }
  };

export const getAll =
  <T>(Model: Model<T>) =>
  async (req: Request, res: Response) => {
    try {
      const docs = await Model.find();
      res.status(200).json({
        status: "success",
        results: docs.length,
        data: { data: docs },
      });
    } catch (error) {
      res
        .status(400)
        .json({ status: "fail", message: (error as Error).message });
    }
  };
