import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top selling products
// @route   GET /api/products/top-selling
// @access  Public
export const getTopSellingProducts = asyncHandler(async (req, res) => {
  const products = await Product.getTopSellingProducts();
  res.json(products);
});

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
export const getNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.getNewProducts();
  res.json(products);
});
