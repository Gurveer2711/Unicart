import express from "express";
import {
  getUserCart,
  addItemToCart,
  decrementQuantityOfCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserCart);
router.post("/add", protect, addItemToCart);
router.post("/remove", protect, decrementQuantityOfCart);
router.post("/clear", protect, clearCart);

export default router;
