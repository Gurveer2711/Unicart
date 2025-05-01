import express from "express";
import {
  getProducts,
  getProductById,
  getTopSellingProducts,
  getNewProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/top-selling", getTopSellingProducts);
router.get("/new", getNewProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
