import express from "express";
import { registerUser, loginUser, logoutUser, checkAuth, verifyOtp, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check", checkAuth);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword/:id", resetPassword);
export default router;
