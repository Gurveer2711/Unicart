import asyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";
import { imageUploadUtil } from "../../config/cloudinary.js";

// Get all products (admin)
export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

// Get product by ID (admin)
export const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
});

// Create new product (admin) - with image upload
export const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      originalPrice,
      discountedPrice,
      category,
      rate = 1,
      count = 0,
      stocksLeft,
    } = req.body;

    if (
      !title ||
      !description ||
      !originalPrice ||
      !discountedPrice ||
      !category ||
      stocksLeft === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let imageUrl = "";

    // Handle image upload if file is provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const url = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadResult = await imageUploadUtil(url);
      imageUrl = uploadResult.secure_url;
    } else {
      return res.status(400).json({ message: "Product image is required" });
    }

    const product = new Product({
      title,
      description,
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      category,
      image: imageUrl,
      rating: {
        rate: Number(rate),
        count: Number(count),
      },
      stocksLeft: Number(stocksLeft),
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
});

// Update product (admin) - with image upload
export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      originalPrice,
      discountedPrice,
      category,
      rate,
      count,
      stocksLeft,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image upload if file is provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const url = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadResult = await imageUploadUtil(url);
      product.image = uploadResult.secure_url;
    }

    // Update fields
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (originalPrice !== undefined)
      product.originalPrice = Number(originalPrice);
    if (discountedPrice !== undefined)
      product.discountedPrice = Number(discountedPrice);
    if (category !== undefined) product.category = category;
    if (stocksLeft !== undefined) product.stocksLeft = Number(stocksLeft);
    if (rate !== undefined || count !== undefined) {
      product.rating = {
        rate: Number(rate) || product.rating?.rate || 1,
        count: Number(count) || product.rating?.count || 0,
      };
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
});

// Delete product (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
});

// Get product statistics (admin)
export const getProductStats = asyncHandler(async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({
      stocksLeft: { $lt: 10 },
    });
    const outOfStockProducts = await Product.countDocuments({ stocksLeft: 0 });

    // Get products by category
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product statistics",
      error: error.message,
    });
  }
});

// Search products (admin)
export const searchProducts = asyncHandler(async (req, res) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let filter = {};

    // Search query
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter (using discountedPrice)
    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = parseFloat(maxPrice);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter).sort(sortOptions);

    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search products", error: error.message });
  }
});
