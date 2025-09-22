// inat-food-backend/src/server.ts

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

import { init as initSocket } from "./socket";

// --- Router Imports (Check every name and path carefully) ---
import userRouter from "./routes/userRoutes";
import categoryRouter from "./routes/categoryRoutes";
// THIS IS THE MOST LIKELY POINT OF ERROR. ENSURE THE FILE NAME MATCHES
import menuItemRouter from "./routes/menuItemRoutes"; // Ensure your file is named 'menuItemRoutes.ts'
import orderRouter from "./routes/orderRoutes";
import stockItemRouter from "./routes/stockItemRoutes";
import addonRouter from "./routes/addonRoutes";
import ingredientRouter from "./routes/ingredientRoutes";
import analyticsRouter from "./routes/analyticsRoutes";

dotenv.config({ path: "./src/config/.env" });
const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = initSocket(server);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// --- API ROUTE REGISTRATION ---
// Double-check the URL prefix used here
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/menu-items", menuItemRouter); // This line MUST match the URL your frontend is calling
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/stock-items", stockItemRouter);
app.use("/api/v1/addons", addonRouter);
app.use("/api/v1/ingredients", ingredientRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("Inat Food POS API is live and running!");
});

const DB = process.env.DATABASE_URL!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);
mongoose
  .connect(DB)
  .then(() => console.log("✅ Database connection successful!"))
  .catch((err) => console.error("❌ Database connection error:", err));

// ... Socket.IO connection logic ...

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
