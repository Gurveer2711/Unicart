import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  res.status(200).json(cart);
});

export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (!productId || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stocksLeft < quantity) {
    return res.status(400).json({ message: "Not enough stock available" });
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  product.stocksLeft -= quantity;
  await product.save();
  await cart.save();
  res.status(200).json(cart);
});

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
    (item) => item.product.toString() === productId
  );
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  const removedItem = cart.items[itemIndex];
  cart.items.splice(itemIndex, 1);

  const product = await Product.findById(productId);
  if (product) {
    product.stocksLeft += removedItem.quantity;
    await product.save();
  }

  await cart.save();
  res.status(200).json({ message: "Item removed from cart" });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stocksLeft += item.quantity;
      await product.save();
    }
  }

  cart.items = [];
  await cart.save();
  res.status(200).json({ message: "Cart cleared" });
});
