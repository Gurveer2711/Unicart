"use client";

import PropTypes from "prop-types";
import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

const CartCard = ({
  item,
  onRemove,
  onIncreaseQuantity,
  onDecreaseQuantity,
  loading,
}) => {
  // Destructure item properties to make the component more readable
  const { quantity, productId } = item;
  const { _id, title, price, image, stocksLeft } = productId;

  // Handle errors gracefully
  if (!productId || !_id) {
    return null; // Don't render invalid items
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow duration-300 relative m-2">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
          <div className="w-6 h-6 border-2 border-[#f46530] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-24 h-24 object-contain rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <p className="text-[#f46530] font-semibold mt-1">${price.toFixed(2)}</p>

        {/* Stock status */}
        {stocksLeft > 5 ? (
          <p className="text-sm text-green-600 mt-1">In Stock</p>
        ) : stocksLeft > 0 ? (
          <p className="text-sm text-orange-500 mt-1">
            Only {stocksLeft} left in stock
          </p>
        ) : (
          <p className="text-sm text-red-500 mt-1">Out of Stock</p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col sm:items-end gap-4">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          {quantity > 1 ? (
            <button
              onClick={() => onDecreaseQuantity(_id, quantity)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              aria-label="Decrease quantity"
              disabled={stocksLeft === 0 || loading}
            >
              <Minus size={16} />
            </button>
          ) : (
            <button
              onClick={() => onRemove(_id)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-red-500 disabled:opacity-50"
              aria-label="Remove item"
              disabled={loading}
            >
              <Trash2 size={16} />
            </button>
          )}

          <span className="px-4 py-1 text-center w-12">{quantity}</span>

          <button
            onClick={() => onIncreaseQuantity(_id)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Increase quantity"
            disabled={stocksLeft === 0 || loading}
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => onRemove(_id)}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
          disabled={loading}
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
};

CartCard.propTypes = {
  item: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    productId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
      stocksLeft: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onIncreaseQuantity: PropTypes.func.isRequired,
  onDecreaseQuantity: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

// Using React.memo with a custom comparison function for deeper prop checking
export default React.memo(CartCard, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.productId._id === nextProps.item.productId._id &&
    prevProps.item.productId.price === nextProps.item.productId.price &&
    prevProps.item.productId.stocksLeft === nextProps.item.stocksLeft &&
    prevProps.loading === nextProps.loading
  );
});
