import express from "express";

import {
  getNearbyNGOs,
} from "../controllers/ngoController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

// =====================================================
// FIND NEARBY NGOs
// =====================================================

router.get(
  "/nearby",
  protect,
  getNearbyNGOs
);

export default router;