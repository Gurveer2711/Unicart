import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, addToCart, fetchCart } from "../features/cartSlice";
import { NavLink } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);

  // Fetch cart when component mounts
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Debugging: Log cart items whenever they change
  useEffect(() => {
    console.log("🛒 Updated Cart State:", items);
  }, [items]);

  // Remove item from cart
  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Update item quantity
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(addToCart({ productId, quantity }));
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
            <div
              key={item.productId._id}
              className="flex flex-col sm:flex-row items-center justify-between border p-6 mb-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
            >
              {/* Product Image and Details */}
              <div className="flex items-center space-x-6">
                <img
                  src={item.productId.image}
                  alt={item.productId.title}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.productId.title}
                  </h2>
                  <p className="text-gray-600">${item.productId.price}</p>
                </div>
              </div>

              {/* Quantity Input and Remove Button */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.productId._id,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-20 border p-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-black"
                  min="1"
                />
                <button
                  onClick={() => handleRemove(item.productId._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Price */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">
              Total:{" "}
              <span className="text-[#f46530]">${totalPrice.toFixed(2)}</span>
            </h2>
            <button className="mt-4 w-full sm:w-auto bg-[#f46530] text-white px-6 py-3 rounded-lg hover:bg-[#da6236] transition-colors duration-300">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
