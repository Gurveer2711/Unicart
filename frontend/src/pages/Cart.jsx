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
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const totalAmount = useSelector(selectCartTotalAmount);

  const selectIsItemLoading = makeSelectIsItemLoading();

  useEffect(() => {
    dispatch(fetchCart())
      .unwrap()
      .catch((error) => {
        console.error("Failed to fetch cart:", error);
      });
  }, [dispatch]);

  const handleRemove = useCallback(
    async (productId) => {
      try {
        await dispatch(removeFromCart(productId)).unwrap();
      } catch (error) {
        console.error("Failed to remove item:", error);
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
        dispatch(fetchCart());
      }
    },
    [dispatch]
  );

  const itemLoadingStates = useSelector((state) =>
    items.reduce((acc, item) => {
      acc[item.productId._id] = selectIsItemLoading(state, item.productId._id);
      return acc;
    }, {})
  );

  const isInitialLoading = loading && items.length === 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
      {isInitialLoading ? (
        <p className="text-center text-gray-600">Loading cart...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
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
          {items.map((item) => (
            <CartCard
              key={item.productId._id}
              item={item}
              onRemove={handleRemove}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              loading={itemLoadingStates[item.productId._id]}
            />
          ))}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Total:{" "}
              <span className="text-[#f46530]">
                ${totalAmount ? totalAmount.toFixed(2) : "0.00"}
              </span>
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
