import PropTypes from "prop-types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

const CartCard = ({
  item,
  onRemove,
  onIncreaseQuantity,
  onDecreaseQuantity,
  loading,
}) => {
  const { quantity, productId } = item;
  const { _id, title, image, stocksLeft } = productId;
  const navigate = useNavigate();

  if (!productId || !_id) return null;

  const handleCartCardClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow duration-300 mb-4"
      onClick={handleCartCardClick}
    >
      <div className="flex-shrink-0">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-24 h-24 object-contain rounded-md"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-lg font-medium text-gray-800 font-['Karla']">
          {title}
        </h2>
        <div className="flex items-center gap-2 mt-1 font-['Karla']">
          <p className="text-xl font-bold text-black line-through">
            Rs {productId.originalPrice * 1.2}
          </p>
          <p className="text-xl font-bold text-[#f46530]">
            Rs {productId.discountedPrice}
          </p>
        </div>
        {stocksLeft > 5 ? (
          <p className="text-sm text-green-600 mt-1 font-['Karla']">In Stock</p>
        ) : stocksLeft > 0 ? (
          <p className="text-sm text-orange-500 mt-1 font-['Karla']">
            Only {stocksLeft} left in stock
          </p>
        ) : (
          <p className="text-sm text-red-500 mt-1 font-['Karla']">
            Out of Stock
          </p>
        )}
      </div>
      <div className="flex flex-col sm:items-end gap-4">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDecreaseQuantity(_id, quantity);
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={quantity > 1 ? "Decrease quantity" : "Remove item"}
            disabled={stocksLeft === 0 || loading}
          >
            {quantity > 1 ? <Minus size={16} /> : <Trash2 size={16} />}
          </button>
          <span className="px-4 py-1 text-center w-12 font-['Karla']">
            {loading ? <span className="animate-pulse">...</span> : quantity}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIncreaseQuantity(_id);
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Increase quantity"
            disabled={stocksLeft === 0 || loading}
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(_id);
          }}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm font-['Karla']"
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
