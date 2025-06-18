import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productSlice";
import ProductCard from "../components/ProductCard";
import AdminProducts from "./admin-view/AdminProducts";
import { useNotification } from "../context/NotificationContext";

const Products = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const { addNotification } = useNotification();
  const successMessage = useSelector((state) => state.cart.successMessage);

  useEffect(() => {
    if (successMessage) {
      addNotification({
        message: successMessage,
        type: "success",
        duration: 3000,
      });
      dispatch({ type: "cart/clearSuccessMessage" });
    }
  }, [successMessage, dispatch, addNotification]);

  useEffect(() => {
    if (error) {
      addNotification({
        message: error,
        type: "error",
        duration: 5000,
      });
      dispatch({ type: "cart/clearError" });
    }
  }, [error, dispatch, addNotification]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Memoize categories for filtering
  const categories = useMemo(() => {
    return items.length > 0
      ? ["all", ...new Set(items.map((product) => product.category))]
      : [];
  }, [items]);

  const filteredProducts = useMemo(() => {
    return items.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "priceLowHigh":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // If user is admin, show admin products page
  if (userInfo?.role === "admin") {
    return <AdminProducts />;
  }

  return (
    <div className="container mx-auto p-4 mt-4">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {/* Search, Filter, and Sort UI */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-black rounded-lg flex-grow"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-black rounded-lg"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>

        {/* Sort By Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-black rounded-lg"
        >
          <option value="default">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="rating">Rating: High to Low</option>
        </select>
      </div>

      {/* Status Messages */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No products found.</div>
      )}
    </div>
  );
};

export default Products;
