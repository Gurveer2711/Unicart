import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Cart from "../models/cartModel.js";

export const registerUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res
      .status(200)
      .json({ message: "User is already logged in.Please logout first." });
  }
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = new User({
    name,
    email,
    password,
  });

  const cart = await Cart.create({ user: user._id, items: [] });
  user.cart = cart._id;
  const savedUser = await user.save();
  if (savedUser) {
    res.status(200).json({
      message: "Registration Successful.Please Log In.",
      redirect: "/api/auth/login",
    });
  } else {
    res.status(400);
    throw new Error("Registration failed");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  let token = req.cookies.token;
  if (token) {
    return res
      .status(200)
      .json({ message: "User is already logged in.Please logout first." });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT Token
  token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // Set Secure Cookie
  res.cookie("token", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "Strict", // Prevents CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return res.status(200).json({
    message: "Login successful!",
    user: { _id: user._id, email: user.email, role: user.role },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie with the same options that were used when setting it
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0), // Set expiration to epoch time (immediately expired)
  });

  res
    .status(200)
    .json({
      message: "Logged out successfully",
    });
});
