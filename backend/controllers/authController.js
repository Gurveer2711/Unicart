import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Cart from "../models/cartModel.js";
export const registerUser = asyncHandler(async (req, res) => {
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
      message: "Registration Successful",
      redirect: "/api/auth/login",
    });
  } else {
    res.status(400);
    throw new Error("Registration failed");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: "Email and password are required" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.cookie("token", token, { httpOnly: true, secure: false });
  return res.status(200).json({
    message: "Login successful!",
    redirect: "/api/home",
   });
});
