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

export const getTopSellingProducts = async (req, res) => {
  try {
    const products = await Product.getTopSellingProducts();
    res.status(200).json(products); // Return the top-selling products
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching top-selling products", error });
  }
};

// Controller to get new products by category
export const getNewProductsByCategory = async (req, res) => {
  try {
    const products = await Product.getNewProductsByCategory();
    res.status(200).json(products); // Return the new products in the category
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching new products by category", error });
  }
};