import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

app.use(cors());
app.use(express.json());

// =========================
// ROUTES
// =========================

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

// =========================
// HEALTH CHECK
// =========================

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

// =========================
// START SERVER
// =========================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  startRequestDispatcher();

  app.listen(PORT, () => {
    console.log(
      `HelpGrid server running on port ${PORT}`
    );
  });
};

startServer();