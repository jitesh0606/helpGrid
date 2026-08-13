import express from "express";
import {
  register,
  login,
  createAdmin,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.post("/create-admin", createAdmin);
router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You have access to a protected route.",
    user: req.user,
  });
});

export default router;