"use client";

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stocks, setStocks] = useState(product.stocksLeft);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (stocks >= quantity) {
      dispatch(addToCart({ productId: product._id, quantity }));
      setStocks((prevStocks) => prevStocks - quantity);
      setInCart(true);

      setTimeout(() => {
        setInCart(false);
      }, 2000);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border-2 border-[#fff2dd] shadow-lg rounded-xl p-4 transition-transform hover:scale-[1.02] cursor-pointer h-[420px] flex flex-col"
    >
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

        {/* Add to Cart Section */}
        <div className="h-12 flex items-center justify-center mt-auto gap-2">
          {/* Quantity Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-10 w-16 pl-2 pr-6 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#f46530] focus:border-transparent text-sm"
              disabled={stocks === 0}
            >
              {[...Array(Math.min(10, stocks || 10)).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
              <svg
                className="w-3 h-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {inCart ? (
            <span className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm flex-1">
              Added to Cart
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={stocks === 0}
              className={`flex-1 py-2 rounded-lg transition-colors duration-300 text-white text-sm ${
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
