import express from "express";
import {
  getChatMessages,
} from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:helpRequestId",
  protect,
  getChatMessages
);

export default router;