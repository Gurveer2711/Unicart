import express from "express";
import { upload } from "../config/cloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByStatus,
  getOrderStats,
  deleteOrder,
} from "../controllers/admin/orderController.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  searchProducts,
} from "../controllers/admin/productController.js";

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect, admin);

// Order routes
router.get("/orders", getAllOrders);
router.get("/orders/stats", getOrderStats);
router.get("/orders/status/:status", getOrdersByStatus);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

// Product routes with file upload support
router.get("/products", getAllProducts);
router.get("/products/stats", getProductStats);
router.get("/products/search", searchProducts);
router.get("/products/:id", getProductById);
router.post("/products", upload.single("image"), createProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
