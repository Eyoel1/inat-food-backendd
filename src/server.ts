// inat-food-backend/src/server.ts

import dotenv from "dotenv";
// --- THIS IS THE CRITICAL FIX ---
// Load environment variables at the absolute beginning of the application.
// This ensures that any subsequent module (like `cloudinary.ts` or `authController.ts`)
// that is imported will have access to the `process.env` variables.
dotenv.config({ path: "./src/config/.env" });

// Now, all other imports can safely access process.env variables.
import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

import { init as initSocket } from "./socket";

import userRouter from "./routes/userRoutes";
import categoryRouter from "./routes/categoryRoutes";
import menuItemRouter from "./routes/menuItemRoutes";
import orderRouter from "./routes/orderRoutes";
import stockItemRouter from "./routes/stockItemRoutes";
import addonRouter from "./routes/addonRoutes";
import ingredientRouter from "./routes/ingredientRoutes";
import analyticsRouter from "./routes/analyticsRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = initSocket(server);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/menu-items", menuItemRouter);
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

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
  socket.on("join_room", (roomName: string) => {
    socket.join(roomName);
    console.log(
      `\n✅ Client ${socket.id} joined room: ---> ${roomName} <---\n`
    );
  });
  socket.on("admin_reset_kds", (ack) => {
    console.log(`\n🚨 KDS RESET received. Broadcasting command.\n`);
    io.to("Kitchen").to("Juice Bar").emit("kds_cleared");
    if (typeof ack === "function") {
      ack({ success: true, message: "Reset broadcasted." });
    }
  });
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
