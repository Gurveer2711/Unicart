import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, addToCart, fetchCart } from "../features/cartSlice";
import { NavLink } from "react-router-dom";
import CartCard from "../components/CartCard";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);

  // Fetch cart when component mounts
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Remove item from cart
  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    window.location.reload();
  }; 

  // Increase item quantity
  const handleIncreaseQuantity = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  // Decrease item quantity
  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity == 1) {
      handleRemove(productId);
    }
    if (currentQuantity > 1) {
      dispatch(addToCart({ productId, quantity: -1 }));
    }
  };

  const totalPrice = items.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

      {/* Show loading state */}
      {loading && <p className="text-center text-gray-600">Loading cart...</p>}

      {/* Show error message */}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {items.length === 0 && !loading && !error ? (
        <p className="text-gray-800 text-lg text-center my-8 mt-20">
          Your cart is empty. Check out our{" "}
          <NavLink to="/products" className="text-red-600 hover:underline">
            Products
          </NavLink>{" "}
          page.
        </p>
      ) : (
        <div>
          <h2 className="text-4xl my-5 mt-16 font-sans">Your Cart</h2>

          {/* Cart Items */}
          {items.map((item) => (
            <CartCard
              key={item.productId._id}
              item={item}
              onRemove={handleRemove}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
            />
          ))}

          {/* Total Price */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Total:{" "}
              <span className="text-[#f46530]">${totalPrice.toFixed(2)}</span>
            </h2>
            <NavLink to="/checkout" className="mt-4 w-full sm:w-auto bg-[#f46530] text-white px-6 py-3 rounded-lg hover:bg-[#da6236] transition-colors duration-300">
              Checkout
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
