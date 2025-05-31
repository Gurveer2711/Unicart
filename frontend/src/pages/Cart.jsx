import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  addToCart,
  fetchCart,
  clearCart, // Make sure this exists in your cartSlice
} from "../features/cartSlice";
import { NavLink } from "react-router-dom";
import CartCard from "../components/CartCard";
import { useNotification } from "../context/NotificationContext";
import {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartTotalAmount,
  selectItemLoadingStates,
} from "../features/cartSelectors";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const totalAmount = useSelector(selectCartTotalAmount);
  const successMessage = useSelector((state) => state.cart.successMessage);
  const itemLoadingStates = useSelector(selectItemLoadingStates);
  const { addNotification } = useNotification();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      addNotification({
        message: "Log in to see your cart.",
        type: "error",
        duration: 2000,
      });
      navigate("/login");
      return;
    }

    if (successMessage) {
      addNotification({
        message: successMessage,
        type: "success",
        duration: 3000,
      });
      dispatch({ type: "cart/clearSuccessMessage" });
    }
  }, [successMessage, dispatch, addNotification, userInfo, navigate]);

  useEffect(() => {
    if (error) {
      if (error.includes("authentication") || error.includes("unauthorized")) {
        navigate("/login");
        return;
      }
      addNotification({
        message: error,
        type: "error",
        duration: 5000,
      });
      dispatch({ type: "cart/clearError" });
    }
  }, [error, dispatch, addNotification, navigate]);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart())
        .unwrap()
        .catch((error) => {
          if (
            error.includes("authentication") ||
            error.includes("unauthorized")
          ) {
            navigate("/login");
            return;
          }
          addNotification({
            message: error,
            type: "error",
            duration: 3000,
          });
        });
    }
  }, [dispatch, addNotification, userInfo, navigate]);

  useEffect(() => {
    const correctCartStock = async () => {
      for (const item of items) {
        const availableStock = item.productId.stocksLeft;
        const currentQty = item.quantity;

        if (currentQty > availableStock) {
          await dispatch(removeFromCart(item.productId._id));

          if (availableStock > 0) {
            await dispatch(
              addToCart({
                productId: item.productId._id,
                quantity: availableStock,
              })
            );
            addNotification({
              message: `Quantity of "${item.productId.title}" adjusted to available stock (${availableStock}).`,
              type: "error",
              duration: 3000,
            });
          } else {
            addNotification({
              message: `"${item.productId.title}" is out of stock and removed from cart.`,
              type: "error",
              duration: 4000,
            });
          }
        }
      }
    };

    if (items.length > 0) {
      correctCartStock();
    }
  }, [items, dispatch, addNotification]);

  const handleRemove = useCallback(
    async (productId) => {
      try {
        await dispatch(removeFromCart(productId)).unwrap();
      } catch {
        dispatch(fetchCart());
      }
    },
    [dispatch]
  );

  const handleIncreaseQuantity = useCallback(
    async (productId) => {
      try {
        await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      } catch {
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
      } catch {
        dispatch(fetchCart());
      }
    },
    [dispatch]
  );

  const handleClearCart = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      throw new error();
    }
  }, [dispatch]);

  const isInitialLoading = loading && items.length === 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 font-['Karla']">
        Your Cart
      </h1>

      {isInitialLoading ? (
        <p className="text-center text-gray-600 font-['Karla']">
          Loading cart...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 font-['Karla']">
          Error:{" "}
          {typeof error === "object"
            ? error.message || "An error occurred"
            : error}
        </p>
      ) : items.length === 0 ? (
        <p className="text-gray-800 text-lg text-center my-8 mt-20 font-['Karla']">
          Your cart is empty. Check out our{" "}
          <NavLink to="/products" className="text-red-600 hover:underline">
            Products
          </NavLink>
          .
        </p>
      ) : (
        <div>
          {/* Cart Header with Clear Cart */}
          <div className="flex justify-between items-center my-5 mt-16">
            <h2 className="text-4xl font-['Karla']">Your Cart</h2>
            <button
              onClick={handleClearCart}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Clear Cart
            </button>
          </div>

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
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['Karla']">
              Total:{" "}
              <span className="text-[#f46530]">
                Rs {totalAmount ? totalAmount.toFixed(0) : "0"}
              </span>
            </h2>
            <NavLink
              to="/checkout"
              className="mt-4 w-full sm:w-auto bg-[#f46530] text-white px-6 py-3 rounded-lg hover:bg-[#da6236] transition-colors duration-300 font-['Karla']"
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
