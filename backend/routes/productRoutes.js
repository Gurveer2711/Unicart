import express from "express";
import {
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/top-selling", getTopSellingProducts);
router.get("/new", getNewProductsByCategory);

export default router;
