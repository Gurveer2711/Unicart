import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";

export const getUserCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items");
     if (!cart) {
       return res.status(404).json({ message: "Cart not found" });
     }

     res.status(200).json(cart);
});

export const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, price } = req.body;
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
     if (!cart) {
         cart = new Cart({ user: userId, items: [], totalAmount: 0 });
    }
    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price += price;
    }
    else {
        cart.items.push({ product: productId, quantity, price });
    }
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
    res.status(200).json(cart);
})

export const decrementQuantityOfCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId, price } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
        if (existingItem.quantity === 0) {
            cart.items.filter((item) => item.product.toString() !== productId);
        }
        else {
            existingItem.quantity -= 1;
            existingItem.price -= price;
        }
    }
    cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
    );
    await cart.save();
    res.status(200).json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();
  res.status(200).json({ message: "Cart cleared" });
}); 