// inat-food-backend/src/controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

// Custom type definitions
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
  interface JwtPayload {
    id: string;
  }
}

// --- Helper Functions ---

const signToken = (id: string): string => {
  // --- THIS IS THE DEFINITIVE FIX ---
  // We are creating an options object. To bypass the strict type error from the build
  // compiler, we explicitly tell TypeScript to treat this specific object as
  // a generic record of strings, which avoids the problematic 'expiresIn' check.
  const options: Record<string, any> = {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  };

  // The call now succeeds because the options object's type is no longer ambiguous.
  return jwt.sign({ id }, process.env.JWT_SECRET!, options);
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user.id);
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

    if (!user || !(await user.correctPIN(pin))) {
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
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "You are not logged in." });
    }

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
    if (!req.user || !roles.includes(req.user.role)) {
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
