import express from "express";

import {
  createHelpRequest,
  getNearbyRequests,
  getMyRequests,
  acceptHelpRequest,
  rejectHelpRequest,
  startHelpRequest,
  completeHelpRequest,
  cancelHelpRequest,
  getMyAssignedRequests,
} from "../controllers/helpRequestController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create help request
router.post(
  "/",
  protect,
  createHelpRequest
);

// Get nearby requests - NGO
router.get(
  "/nearby",
  protect,
  getNearbyRequests
);

// Get assigned requests - NGO
router.get(
  "/assigned",
  protect,
  getMyAssignedRequests
);

// Get user's own requests
router.get(
  "/my",
  protect,
  getMyRequests
);

// Accept request - NGO
router.patch(
  "/:id/accept",
  protect,
  acceptHelpRequest
);

// Reject request - NGO
router.patch(
  "/:id/reject",
  protect,
  rejectHelpRequest
);

// Start request - NGO
router.patch(
  "/:id/start",
  protect,
  startHelpRequest
);

// Complete request - NGO
router.patch(
  "/:id/complete",
  protect,
  completeHelpRequest
);

// Cancel request - User
router.patch(
  "/:id/cancel",
  protect,
  cancelHelpRequest
);

export default router;