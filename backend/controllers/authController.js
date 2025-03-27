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
      .json({ message: "User is already logged in. Please log out first." });
  }

  const { name, email, password, role } = req.body;

  // Admin role check
  if (role === "admin") {
    const { secretAdminCode } = req.body;
    if (secretAdminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ message: "Invalid admin code" });
    }
  }

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
    role,
  });

  // Create user cart
  const cart = await Cart.create({ user: user._id, items: [] });
  user.cart = cart._id;

  const savedUser = await user.save();
  if (savedUser) {
    return res.status(200).json({
      message: "Registration successful. Please log in.",
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
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0), // Expired immediately
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

export const checkAuth = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});
