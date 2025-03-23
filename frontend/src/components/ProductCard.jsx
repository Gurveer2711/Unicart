"use client";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { useEffect, useState } from "react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [stocks, setStocks] = useState(product.stocksLeft);
  const [inCart, setInCart] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (stocks > 0) {
      dispatch(addToCart({ productId: product._id, quantity: 1 }));
      setStocks((prevStocks) => prevStocks - 1);
      setInCart(true);

      // Set inCart back to false after 2 seconds
      setTimeout(() => {
        setInCart(false);
      }, 2000);
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
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
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.title}
          </h3>

          <div className="flex items-center justify-center gap-1 text-[#f46530] mt-1">
            {"⭐".repeat(Math.ceil(product.rating.rate))}{" "}
            <span className="text-gray-500 text-sm">
              ({product.rating.count})
            </span>
          </div>

          <p className="text-xl font-bold text-[#f46530] mt-2">
            ${product.price}
          </p>

          <p className="text-gray-600 text-sm mt-1">
            Stock Left: <span className="font-semibold">{stocks}</span>
          </p>

          {/* Add to Cart Button */}
          <div className="h-12 flex items-center justify-center mt-auto">
            {inCart ? (
              <span className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Added to Cart
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={stocks === 0}
                className={`w-full py-2 rounded-lg transition-colors duration-300 text-white ${
                  stocks === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#f46530] hover:bg-[#d95327]"
                }`}
              >
                Add to Cart
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
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    stocksLeft: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
