import expressAsyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    Create a new checkout session with order details
// @route   POST /api/checkout/create-checkout-session
// @access  Private
const createCheckoutSession = expressAsyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    shippingPrice = 5.99,
    taxRate = 0.05, // 5% tax rate
  } = req.body;

  // Validate shipping address
  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  // Validate payment method
  if (!paymentMethod) {
    res.status(400);
    throw new Error("Payment method is required");
  }

  const userId = req.user._id;

  // Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  }

  // Calculate prices
  const itemsPrice = cart.items.reduce((acc, item) => {
    return acc + item.productId.price * item.quantity;
  }, 0);

  const taxPrice = Number((itemsPrice * taxRate).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  // Create checkout session
  const checkoutSession = {
    userId,
    cartItems: cart.items.map((item) => ({
      product: item.productId._id,
      name: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };

  res.status(200).json({
    success: true,
    checkoutSession,
  });
});

// @desc    Process the checkout and create order
// @route   POST /api/checkout/process-order
// @access  Private
const processOrder = expressAsyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  const userId = req.user._id;

  // Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  }

  // Create order items from cart items
  const orderItems = cart.items.map((item) => {
    return {
      product: item.productId._id,
      title: item.productId.title,
      quantity: item.quantity,
      price: item.productId.price,
      image: item.productId.image,
    };
  });

  // Create order
  const order = new Order({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: Number(itemsPrice),
    shippingPrice: Number(shippingPrice),
    taxPrice: Number(taxPrice),
    totalPrice: Number(totalPrice),
    isPaid: paymentMethod === "Cash On Delivery" ? false : true,
    paidAt: paymentMethod === "Cash On Delivery" ? null : Date.now(),
    status: paymentMethod === "Cash On Delivery" ? "pending" : "processing",
  });

  const createdOrder = await order.save();

  // Update product stock quantity
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stocksLeft = Math.max(0, product.stocksLeft - item.quantity);
      await product.save();
    }
  }

  // Clear cart
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    order: createdOrder,
  });
});

export { createCheckoutSession, processOrder };
