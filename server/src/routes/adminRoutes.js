import express from "express";

import {
  getPendingNGOs,
  verifyNGO,
  rejectNGO,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all pending NGOs
router.get(
  "/ngos/pending",
  protect,
  adminOnly,
  getPendingNGOs
);

// Verify NGO
router.patch(
  "/ngos/:id/verify",
  protect,
  adminOnly,
  verifyNGO
);

// Reject NGO
router.patch(
  "/ngos/:id/reject",
  protect,
  adminOnly,
  rejectNGO
);

export default router;