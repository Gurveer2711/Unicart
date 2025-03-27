import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Cart from "../models/cartModel.js";
import OTP from "../models/otpModel.js";
import transporter from "../config/emailConfig.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Forgot Password - Send OTP
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate and store OTP
  const otp = generateOTP();
  await OTP.create({ email, otp });

  // Send OTP via email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; text-align: center; background-color: #f9f9f9;">
      <h2 style="color: #f46530;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #333;">
        You have requested to reset your password. Use the OTP below to proceed.
      </p>
      <div style="font-size: 24px; font-weight: bold; color: #d95327; background: #fff; padding: 10px; border-radius: 8px; display: inline-block; margin: 15px 0;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #666;">
        This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #888;">
        Need help? Contact our support team at <a href="mailto:support@unicart.com" style="color: #f46530; text-decoration: none;">support@unicart.com</a>
      </p>
    </div>
  `,
  };
  await transporter.sendMail(mailOptions);

  res.status(200).json({ redirect:"/api/auth/verifyOtp" });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const otpRecord = await OTP.findOne({ otp });
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }
  const { email } = otpRecord;
  const user = User.findOne({ email });

  console.log("User ID:", user._id);
  await OTP.deleteOne({ otp });

  return res
    .status(200)
    .json({ redirect: `/api/auth/resetPassword/${user._id}` });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res.status(401).json({ error: "Passwords do not match" });
  }
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  return res.status(200).json({ redirect: "/api/auth/login" });
});

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
