// inat-food-backend/src/server.ts

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

// --- Import Custom Socket Initialization ---
import { init as initSocket } from "./socket";

// --- Import All API Routers ---
import userRouter from "./routes/userRoutes";
import categoryRouter from "./routes/categoryRoutes";
import menuItemRouter from "./routes/menuItemRoutes";
import orderRouter from "./routes/orderRoutes";
import stockItemRouter from "./routes/stockItemRoutes";
import addonRouter from "./routes/addonRoutes";
import ingredientRouter from "./routes/ingredientRoutes";
import analyticsRouter from "./routes/analyticsRoutes";

// --- Basic Server and Socket Setup ---
// The `.env` config MUST be at the top to load variables for other files.
dotenv.config({ path: "./src/config/.env" });

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO and pass it our server and CORS config
const io = initSocket(server, {
  cors: {
    origin: "*", // Allow connections from any origin
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

// --- Global Middleware ---
// 1. Enable CORS for all incoming Express requests. This is crucial for deployment.
app.use(cors());
// 2. Body parser, reading data from body into req.body
app.use(express.json({ limit: "10mb" })); // Increased limit for potential base64 uploads

// --- Register All API ROUTES ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/menu-items", menuItemRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/stock-items", stockItemRouter);
app.use("/api/v1/addons", addonRouter);
app.use("/api/v1/ingredients", ingredientRouter);
app.use("/api/v1/analytics", analyticsRouter);

// --- Simple Root Route for Health Checks ---
app.get("/", (req, res) => {
  res.send("Inat Food POS API is live and running!");
});

// --- DATABASE CONNECTION ---
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}
const DB = DB_URL.replace("<PASSWORD>", process.env.DATABASE_PASSWORD!);

mongoose
  .connect(DB)
  .then(() => console.log("✅ Database connection successful!"))
  .catch((err) => console.error("❌ Database connection error:", err));

// --- SOCKET.IO REAL-TIME EVENT HANDLING ---
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("join_room", (roomName: string) => {
    socket.join(roomName);
    console.log(
      `\n✅ Client ${socket.id} SUCCESSFULLY joined room: ---> ${roomName} <---\n`
    );
  });

  socket.on("admin_reset_kds", (ack) => {
    console.log(`\n🚨 KDS RESET COMMAND received from socket ${socket.id}.`);
    io.to("Kitchen").to("Juice Bar").emit("kds_cleared");
    if (typeof ack === "function") {
      ack({ success: true, message: "Reset command broadcasted." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// --- START THE SERVER ---
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
