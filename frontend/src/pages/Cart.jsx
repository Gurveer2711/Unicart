"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, addToCart, fetchCart } from "../features/cartSlice";
import { NavLink } from "react-router-dom";
import CartCard from "../components/CartCard";
import {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartTotalAmount,
  makeSelectIsItemLoading,
} from "../features/cartSelectors";

const Cart = () => {
  const dispatch = useDispatch();

  // Use memoized selectors for better performance
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const totalAmount = useSelector(selectCartTotalAmount);

  // Create a selector for checking if a specific item is loading
  const selectIsItemLoading = makeSelectIsItemLoading();

  // Fetch cart data when component mounts
  useEffect(() => {
    // Dispatch fetchCart and handle any errors
    dispatch(fetchCart())
      .unwrap()
      .catch((error) => {
        console.error("Failed to fetch cart:", error);
      });
  }, [dispatch]);

  // Memoize handler functions to prevent new function references on each render
  const handleRemove = useCallback(
    async (productId) => {
      try {
        await dispatch(removeFromCart(productId)).unwrap();
      } catch (error) {
        console.error("Failed to remove item:", error);
        // Refresh cart data to ensure UI is in sync with server
        dispatch(fetchCart());
      }
    },
    [dispatch]
  );

  const handleIncreaseQuantity = useCallback(
    async (productId) => {
      try {
        await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      } catch (error) {
        console.error("Failed to increase quantity:", error);
        // Refresh cart data to ensure UI is in sync with server
        dispatch(fetchCart());
      }
    },
    [dispatch]
  );

  const handleDecreaseQuantity = useCallback(
    async (productId, currentQuantity) => {
      try {
        if (currentQuantity === 1) {
          await dispatch(removeFromCart(productId)).unwrap();
        } else {
          await dispatch(addToCart({ productId, quantity: -1 })).unwrap();
        }
      } catch (error) {
        console.error("Failed to decrease quantity:", error);
        // Refresh cart data to ensure UI is in sync with server
        dispatch(fetchCart());
      }
    },
    [dispatch]
  );

  // Memoize the loading states for each item
  const itemLoadingStates = useSelector((state) =>
    items.reduce((acc, item) => {
      acc[item.productId._id] = selectIsItemLoading(state, item.productId._id);
      return acc;
    }, {})
  );

  // Determine if we're in the initial loading state
  const isInitialLoading = loading && items.length === 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

      {isInitialLoading ? (
        <p className="text-center text-gray-600">Loading cart...</p>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchCart())}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-800 text-lg text-center my-8 mt-20">
          Your cart is empty. Check out our{" "}
          <NavLink to="/products" className="text-red-600 hover:underline">
            Products
          </NavLink>
          .
        </p>
      ) : (
        <div>
          <h2 className="text-4xl my-5 mt-16 font-sans">Your Cart</h2>

          {/* Cart Items */}
          {items.map((item) => {
            // Use the selector to check if this specific item is loading
            const isItemLoading = itemLoadingStates[item.productId._id];

            return (
              <CartCard
                key={item.productId._id}
                item={item}
                onRemove={handleRemove}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                loading={isItemLoading}
              />
            );
          })}

          {/* Total Price - Using the value from Redux state */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Total:{" "}
              <span className="text-[#f46530]">${totalAmount.toFixed(2)}</span>
            </h2>
            <NavLink
              to="/checkout"
              className="mt-4 w-full sm:w-auto bg-[#f46530] text-white px-6 py-3 rounded-lg hover:bg-[#da6236] transition-colors duration-300"
            >
              Checkout
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
