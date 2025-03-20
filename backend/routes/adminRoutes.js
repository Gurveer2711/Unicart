import express from "express";
import {
  getAdminDashboard,
  addProduct,
  getUsers,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getAdminDashboard);
router.post("/addProduct", protect, admin, addProduct);
router.get("/users", protect, admin, getUsers);
    
export default router;
