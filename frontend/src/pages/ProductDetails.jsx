"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../features/productSlice";
import { addToCart } from "../features/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Fetch product only when ID changes
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Selecting product and cart state from Redux
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  // Local state for UI updates
  const [inCart, setInCart] = useState(false);
  const [stockLeft, setStockLeft] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Update stockLeft when the selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setStockLeft(selectedProduct.stocksLeft);
    }
  }, [selectedProduct]);

  // Handle Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (stockLeft >= quantity) {
      dispatch(addToCart({ productId: selectedProduct._id, quantity }));
      setInCart(true);
      setStockLeft((prevStock) => prevStock - quantity); // Reduce stock by selected quantity

      // Show "Added to Cart" for 2 seconds
      setTimeout(() => {
        setInCart(false);
      }, 2000);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!selectedProduct) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={selectedProduct?.image || "/placeholder.svg"}
          alt={selectedProduct?.title}
          className="w-full h-96 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">{selectedProduct?.title}</h1>
          <p className="text-gray-700 mb-4">{selectedProduct?.description}</p>
          <p className="text-2xl font-semibold mb-4">
            ${selectedProduct?.price}
          </p>

          {/* Stocks Left */}
          <p className="text-gray-600 font-medium mb-4">
            {stockLeft !== null ? stockLeft : "Loading..."} items left in stock
          </p>

          {/* Add to Cart Section */}
          <div className="h-12 flex items-center justify-start mt-auto gap-3">
            {/* Quantity Dropdown */}
            <div className="relative">
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-10 w-20 pl-3 pr-8 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#f46530] focus:border-transparent"
                disabled={stockLeft === 0}
              >
                {[...Array(Math.min(10, stockLeft || 10)).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
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
              <span className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Added to Cart
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={stockLeft === 0}
                className={`px-5 py-2 rounded-lg transition-colors duration-300 text-white ${
                  stockLeft === 0
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
    </div>
  );
};

export default ProductDetails;
