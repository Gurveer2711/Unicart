import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Get User's Cart
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId }).populate("items.productId");

  if (!cart) {
    return res.status(404).json({ message: "Cart is empty" });
  }
  res.status(200).json(cart);
});

// Add Item to Cart
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product || product.stocksLeft < quantity) {
    return res.status(400).json({ message: "Not enough stock available" });
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalAmount: 0 });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await product.save();
  await cart.populate("items.productId");
  cart.totalAmount = Number(
    cart.items
      .reduce((total, item) => total + item.quantity * item.productId.price, 0)
      .toFixed(2)
  );

  await cart.save();

  // Fetch updated cart with product details
  const updatedCart = await Cart.findOne({ user: userId }).populate(
    "items.productId"
  );

  res.status(201).json(updatedCart);
});


// Remove Item from Cart
export const removeItemFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  const removedItem = cart.items[itemIndex];
  const product = await Product.findById(productId);

    cart.items.splice(itemIndex, 1);
  

  if (product) {
    await product.save();
  }

  await cart.save();
  res.status(201).json(cart);
});

// Clear Cart
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      await product.save();
    }
  }

  cart.items = [];
  await cart.save();
  res.status(200).json({ message: "Cart cleared" });
});
