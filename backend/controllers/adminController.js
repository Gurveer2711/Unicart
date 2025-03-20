import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = asyncHandler(async (req, res) => {
  // Get counts for dashboard
  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();

  // Get recent users
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("-password");

  // Get recent products
  const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    userCount,
    productCount,
    recentUsers,
    recentProducts,
  });
});

// @desc    Add a product
// @route   POST /api/admin/addProduct
// @access  Private/Admin
export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, countInStock } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    image,
    category,
    countInStock,
    createdBy: req.user.id,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});
