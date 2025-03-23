"use client"

import PropTypes from "prop-types"
import { Minus, Plus, Trash2 } from "lucide-react"

const CartCard = ({ item, onRemove, onIncreaseQuantity, onDecreaseQuantity }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow duration-300">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.productId.image || "/placeholder.svg"}
          alt={item.productId.title}
          className="w-24 h-24 object-contain rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h2 className="text-lg font-medium text-gray-800">
          {item.productId.title}
        </h2>
        <p className="text-[#f46530] font-semibold mt-1">
          ${item.productId.price.toFixed(2)}
        </p>

        {/* Stock status indicator */}
        {item.productId.stocksLeft > 5 ? (
          <p className="text-sm text-green-600 mt-1">In Stock</p>
        ) : item.productId.stocksLeft > 0 ? (
          <p className="text-sm text-orange-500 mt-1">
            Only {item.productId.stocksLeft} left in stock
          </p>
        ) : (
          <p className="text-sm text-red-500 mt-1">Out of Stock</p>
        )}
      </div>

      {/* Quantity Controls and Remove Button */}
      <div className="flex flex-col sm:items-end gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          {item.quantity > 1 ? (
            <button
              onClick={() =>
                onDecreaseQuantity(item.productId._id, item.quantity)
              }
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
              disabled={item.productId.stocksLeft === 0}
            >
              <Minus size={16} />
            </button>
          ) : (
            <button
              onClick={() => onRemove(item.productId._id)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-red-500"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          )}

          <span className="px-4 py-1 text-center w-12">{item.quantity}</span>

          <button
            onClick={() => onIncreaseQuantity(item.productId._id)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Increase quantity"
            disabled={item.productId.stocksLeft === 0}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.productId._id)}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
}

// Prop Validation
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
}

export default CartCard

