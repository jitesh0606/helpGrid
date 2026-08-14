import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chatRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import helpRequestRoutes from "./routes/helpRequestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import {
  startRequestDispatcher,
} from "./utils/requestDispatcher.js";

dotenv.config();

const app = express();

// =====================================================
// HTTP SERVER
// =====================================================

const server = http.createServer(app);

// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// ROUTES
// =====================================================

app.use(
  "/api/ngos",
  ngoRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/requests",
  helpRequestRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      status: "OK",
      message:
        "HelpGrid Backend is Healthy 🚀",
    });
  }
);

// =====================================================
// SOCKET CONNECTION
// =====================================================

io.on("connection", (socket) => {
  console.log(
    `Socket connected: ${socket.id}`
  );

  socket.on("disconnect", () => {
    console.log(
      `Socket disconnected: ${socket.id}`
    );
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  startRequestDispatcher();

  server.listen(PORT, () => {
    console.log(
      `HelpGrid server running on port ${PORT}`
    );

    console.log(
      "Socket.io server ready 🚀"
    );
  });
};

startServer();