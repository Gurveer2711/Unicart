"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../features/productSlice";
import { addToCart, removeFromCart } from "../features/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Selecting product and cart state from Redux
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const cartItems = useSelector((state) => state.cart.items);

  // Finding the product in cart using productId
  const cartItem = cartItems.find(
    (item) => item.productId === selectedProduct?._id
  );
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);

  // Fetch product on component mount or when ID changes
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Sync quantity state with Redux cart
  useEffect(() => {
    setQuantity(cartItem ? cartItem.quantity : 1);
  }, [cartItem]);

  // Handle Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ productId: selectedProduct._id, quantity }));
  };

  // Handle Increment with correct state update
  const handleIncrement = (e) => {
    e.preventDefault();
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      dispatch(
        addToCart({ productId: selectedProduct._id, quantity: newQuantity })
      );
      return newQuantity;
    });
  };

  // Handle Decrement with correct removal logic
  const handleDecrement = (e) => {
    e.preventDefault();
    setQuantity((prev) => {
      if (prev > 1) {
        const newQuantity = prev - 1;
        dispatch(
          addToCart({ productId: selectedProduct._id, quantity: newQuantity })
        );
        return newQuantity;
      } else {
        dispatch(removeFromCart(selectedProduct._id));
        return 1;
      }
    });
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

          {/* Add to Cart Button or Quantity Controls */}
          <div className="h-12 flex items-center">
            {cartItem ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecrement}
                  className="bg-[#f46530] text-white px-4 py-2 rounded-lg hover:bg-[#dc6438]"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="bg-[#f46530] text-white px-4 py-2 rounded-lg hover:bg-[#dc6438]"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-[#f46530] text-white px-6 py-2 rounded-lg hover:bg-[#dc6438]"
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
