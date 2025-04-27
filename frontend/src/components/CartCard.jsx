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
  const { quantity, productId } = item;
  const { _id, title, price, image, stocksLeft } = productId;

  if (!productId || !_id) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow duration-300 mb-4">
      <div className="flex-shrink-0">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-24 h-24 object-contain rounded-md"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <p className="text-[#f46530] font-semibold mt-1">${price.toFixed(2)}</p>
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
      <div className="flex flex-col sm:items-end gap-4">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => onDecreaseQuantity(_id, quantity)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={quantity > 1 ? "Decrease quantity" : "Remove item"}
            disabled={stocksLeft === 0 || loading}
          >
            {quantity > 1 ? <Minus size={16} /> : <Trash2 size={16} />}
          </button>
          <span className="px-4 py-1 text-center w-12">
            {loading ? <span className="animate-pulse">...</span> : quantity}
          </span>
          <button
            onClick={() => onIncreaseQuantity(_id)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Increase quantity"
            disabled={stocksLeft === 0 || loading}
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={() => onRemove(_id)}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
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
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onIncreaseQuantity: PropTypes.func.isRequired,
  onDecreaseQuantity: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default CartCard;
