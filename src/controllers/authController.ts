// src/controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

// Custom type definition to add the 'user' property to the Express Request object
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
  // This interface defines the shape of our decoded JWT payload
  interface JwtPayload {
    id: string;
  }
}

// --- Helper Functions ---

const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN!;

  return jwt.sign({ id }, secret, { expiresIn });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());

  const userObj = user.toObject();
  delete userObj.pin;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: userObj },
  });
};

// --- Controller Functions ---

export const signup = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      pin: req.body.pin,
      role: req.body.role,
    });
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, pin } = req.body;

    if (!username || !pin) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please provide username and pin." });
    }

    const user = await User.findOne({ username }).select("+pin");

    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect username or pin." });
    }

    if (!(await user.correctPIN(pin))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect username or pin." });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ status: "fail", message: (error as Error).message });
  }
};

// --- Middleware for Route Protection ---

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "You are not logged in!" });
    }

    // THIS IS THE CORRECT, MODERN WAY TO VERIFY THE TOKEN WITH TYPESCRIPT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res
        .status(401)
        .json({
          status: "fail",
          message: "User for this token no longer exists.",
        });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: "fail", message: "Invalid token or session expired." });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // We can be sure req.user exists because this middleware runs after protect()
    if (!roles.includes(req.user!.role)) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "You do not have permission for this action.",
        });
    }
    next();
  };
};
