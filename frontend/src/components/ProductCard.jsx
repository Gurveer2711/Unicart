"use client";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../features/cartSlice";
import { useState, useEffect } from "react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);

  // Update local quantity when cart changes
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1); // Reset to 1 when not in cart
    }
  }, [cartItem]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stocksLeft) {
      setQuantity(quantity + 1);
      dispatch(addToCart({ id: product.id, quantity: quantity + 1 }));
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
      dispatch(addToCart({ id: product.id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(product.id));
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white shadow-lg rounded-xl p-4 transition-transform hover:scale-[1.02] cursor-pointer h-[420px] flex flex-col">
        {/* Image Container */}
        <div className="overflow-hidden rounded-lg h-52 flex justify-center items-center flex-shrink-0">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Product Details */}
        <div className="mt-4 text-center flex flex-col flex-grow">
          {/* Product Title */}
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 text-[#f46530] mt-1">
            {"⭐".repeat(Math.ceil(product.rating.rate))}{" "}
            <span className="text-gray-500 text-sm">
              ({product.rating.count})
            </span>
          </div>

          {/* Price */}
          <p className="text-xl font-bold text-[#f46530] mt-2">
            ${product.price}
          </p>

          {/* Stock Left */}
          <div className="flex"></div>
          <p className="text-gray-600 text-sm mt-1">
            Stock Left:{" "}
            <span className="font-semibold">{product.stocksLeft}</span>
          </p>

          {/* Add to Cart Button or Quantity Controls */}
          <div className="h-12 flex items-center justify-center mt-auto">
            {cartItem ? (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleDecrement}
                  className="bg-[#f46530] text-white px-4 py-2 rounded-lg hover:bg-[#dc6438]"
                >
                  -
                </button>
                <span>{cartItem.quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={cartItem.quantity >= product.stocksLeft} // Disable if stock is reached
                  className={`px-4 py-2 rounded-lg text-white ${
                    cartItem.quantity >= product.stocksLeft
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#f46530] hover:bg-[#dc6438]"
                  }`}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.stocksLeft === 0} // Disable if out of stock
                className={`w-full py-2 rounded-lg transition-colors duration-300 text-center text-white ${
                  product.stocksLeft === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#f46530] hover:bg-[#d95327]"
                }`}
              >
                {product.stocksLeft === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Prop Validation
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    stocksLeft: PropTypes.number.isRequired, // Added stock validation
  }).isRequired,
};

export default ProductCard;
