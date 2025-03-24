import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cookieParser from "cookie-parser";
// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token; // Access the token from the cookie

  if (!token) {
    res.status(401);
    throw new Error("Access denied. Please log in again");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401);
    throw new Error("Invalid or expired token. Please log in again.");
  }
});

// Admin middleware
export const admin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
});
