import express from "express";
import { registerUser, loginUser, logoutUser, checkAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check", checkAuth);
export default router;
