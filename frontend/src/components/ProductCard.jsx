import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { userInfo } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);

  const items = useSelector((state) => state.cart.items || []);
  const existingItem = items.find((item) => item.productId === product._id);
  const quantityAdded = existingItem ? existingItem.quantity : 0;
  const remainingStock = Math.max(0, product.stocksLeft - quantityAdded);

  const discountPercent = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      addNotification({
        message: "Please log in to add items to cart",
        type: "error",
        duration: 3000,
      });
      navigate("/login");
      return;
    }

    if (remainingStock <= 0) {
      addNotification({
        message: "Cannot add more. Stock limit reached.",
        type: "error",
        duration: 2000,
      });
      return;
    }

    const qtyToAdd = Math.min(quantity, remainingStock);

    dispatch(addToCart({ productId: product._id, quantity: qtyToAdd }))
      .unwrap()
      .then(() => {
        addNotification({
          message: "Added to cart successfully",
          type: "success",
          duration: 2000,
        });
      })
      .catch((error) => {
        if (
          error.error === "You already have the maximum quantity in your cart"
        ) {
          addNotification({
            message: error.error,
            type: "error",
            duration: 3000,
          });
        } else {
          addNotification({
            message: error.message || "Error adding to cart",
            type: "error",
            duration: 3000,
          });
        }
      });
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border-2 border-[#fff2dd] shadow-lg rounded-xl p-4 transition-transform hover:scale-[1.02] cursor-pointer h-[420px] flex flex-col"
    >
      {/* Image with Discount Badge */}
      <div className="relative overflow-hidden rounded-lg h-52 flex justify-center items-center flex-shrink-0">
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {discountPercent}% OFF
          </div>
        )}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4 text-center flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 truncate font-['Karla']">
          {product.title}
        </h3>

        <div className="flex items-center justify-center gap-1 text-[#f46530] mt-1 font-['Karla']">
          {"⭐".repeat(Math.ceil(product.rating.rate))}
          <span className="text-gray-500 text-sm">{product.rating.count}</span>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2 font-['Karla']">
          <p className="text-xl font-bold text-black line-through">
            ₹{product.originalPrice}
          </p>
          <p className="text-xl font-bold text-[#f46530]">
            ₹{product.discountedPrice}
          </p>
        </div>

        {/* Stock Info */}
        {remainingStock > 5 ? (
          <p className="text-green-600 text-sm mt-1 font-['Karla']">In Stock</p>
        ) : remainingStock > 0 ? (
          <p className="text-orange-500 text-sm mt-1 font-['Karla']">
            Only {remainingStock} left in stock
          </p>
        ) : (
          <p className="text-red-600 text-sm mt-1 font-['Karla']">
            Out of Stock
          </p>
        )}

        {/* Quantity and Add to Cart */}
        <div className="h-12 flex items-center justify-center mt-auto gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-10 w-16 pl-2 pr-6 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#f46530] focus:border-transparent text-sm"
              disabled={remainingStock === 0}
            >
              {[...Array(Math.min(10, remainingStock)).keys()].map((num) => (
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

          <button
            onClick={handleAddToCart}
            disabled={remainingStock === 0}
            className={`flex-1 py-2 rounded-lg transition-colors duration-300 text-white text-sm ${
              remainingStock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#f46530] hover:bg-[#d95327]"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired,
    originalPrice: PropTypes.number.isRequired,
    discountedPrice: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    stocksLeft: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
