import express from "express";
import {
  getUserCart,
  addItemToCart,
  clearCart,
  removeItemFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserCart);
router.post("/add", protect, addItemToCart);
router.post("/remove", protect, removeItemFromCart);
router.post("/clear", protect, clearCart);

export default router;
