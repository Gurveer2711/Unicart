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

  // Update stockLeft when the selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setStockLeft(selectedProduct.stocksLeft);
    }
  }, [selectedProduct]);

  // Handle Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (stockLeft > 0) {
      dispatch(addToCart({ productId: selectedProduct._id, quantity: 1 }));
      setInCart(true);
      setStockLeft((prevStock) => prevStock - 1); // Reduce stock by 1 locally

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

          {/* Add to Cart Button */}
          <div className="h-12 flex items-center justify-start mt-auto">
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
