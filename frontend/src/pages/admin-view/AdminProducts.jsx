import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../context/NotificationContext";
import {
  fetchAllProducts,
  fetchProductStats,
  searchProducts,
  deleteProduct,
  clearSuccessMessage,
  clearError,
  updateFilters,
  clearFilters,
} from "../../features/adminProductSlice";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Power,
  PowerOff,
  RefreshCw,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Grid,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { addNotification } = useNotification();

  const { userInfo } = useSelector((state) => state.auth);
  const {
    products,
    productStats,
    loading,
    error,
    successMessage,
    searchResults,
    filters,
  } = useSelector((state) => state.adminProducts);

  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Load initial data
  useEffect(() => {
    if (userInfo?.role === "admin") {
      dispatch(fetchAllProducts());
      dispatch(fetchProductStats());
    }
  }, [dispatch, userInfo]);

  // Handle notifications
  useEffect(() => {
    if (successMessage) {
      addNotification({
        message: successMessage,
        type: "success",
        duration: 3000,
      });
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, addNotification, dispatch]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "object"
          ? error.message || "An error occurred"
          : error;
      addNotification({
        message: errorMessage,
        type: "error",
        duration: 5000,
      });
      dispatch(clearError());
    }
  }, [error, addNotification, dispatch]);

  // Handle search and filters
  const handleSearch = () => {
    const searchParams = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        searchParams[key] = filters[key];
      }
    });
    dispatch(searchProducts(searchParams));
  };

  const handleFilterChange = (key, value) => {
    dispatch(updateFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchAllProducts());
  };

  // Handle product actions
  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await dispatch(deleteProduct(productToDelete._id)).unwrap();
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // const handleToggleStatus = async (productId) => {
  //   try {
  //     await dispatch(toggleProductStatus(productId)).unwrap();
  //   } catch (error) {
  //     console.error("Failed to toggle product status:", error);
  //   }
  // };

  const handleRefresh = () => {
    dispatch(fetchAllProducts());
    dispatch(fetchProductStats());
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Get stock color
  const getStockColor = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const displayProducts = searchResults.length > 0 ? searchResults : products;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "products"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Products
          </button>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productStats?.totalProducts || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productStats?.activeProducts || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Inactive Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productStats?.inactiveProducts || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Low Stock
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productStats?.lowStockProducts || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Out of Stock
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productStats?.outOfStockProducts || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            {productStats?.categoryStats &&
              productStats.categoryStats.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Products by Category
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {productStats.categoryStats.map((category, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {category.count}
                        </div>
                        <div className="text-sm text-gray-600">
                          {category._id || "Uncategorized"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Product Catalog
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage and organize your product inventory
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setShowProductModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.query}
                      onChange={(e) =>
                        handleFilterChange("query", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-orange-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-orange-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice}
                        onChange={(e) =>
                          handleFilterChange("minPrice", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange("maxPrice", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          handleFilterChange("sortBy", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="createdAt">Date Created</option>
                        <option value="title">Name</option>
                        <option value="price">Price</option>
                        <option value="stock">Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={handleSearch}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Search
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 mt-2">
                    {searchResults.length > 0
                      ? "No products match your search criteria."
                      : "Start by adding your first product."}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onEdit={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}
                      onDelete={() => {
                        setProductToDelete(product);
                        setShowDeleteConfirm(true);
                      }}
                      getStockColor={getStockColor}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayProducts.map((product) => (
                        <ProductRow
                          key={product._id}
                          product={product}
                          onEdit={() => {
                            setSelectedProduct(product);
                            setShowProductModal(true);
                          }}
                          onDelete={() => {
                            setProductToDelete(product);
                            setShowDeleteConfirm(true);
                          }}
                          getStockColor={getStockColor}
                          formatPrice={formatPrice}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && productToDelete && (
        <DeleteConfirmModal
          product={productToDelete}
          onConfirm={handleDeleteProduct}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setProductToDelete(null);
          }}
        />
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  onEdit,
  onDelete,
  getStockColor,
  formatPrice,
}) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );

  return (
    <div className="bg-white border-2 border-[#fff2dd] shadow-lg rounded-xl p-4 transition-transform hover:scale-[1.02] cursor-pointer h-[420px] flex flex-col">
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

        {/* Price (copied from user ProductCard) */}
        <div className="flex items-center justify-center gap-2 mt-2 font-['Karla']">
          <p className="text-xl font-bold text-black line-through">
            ₹{product.originalPrice}
          </p>
          <p className="text-xl font-bold text-[#f46530]">
            ₹{product.discountedPrice}
          </p>
        </div>

        {/* Stock Info */}
        {product.stocksLeft > 5 ? (
          <p className="text-green-600 text-sm mt-1 font-['Karla']">In Stock</p>
        ) : product.stocksLeft > 0 ? (
          <p className="text-orange-500 text-sm mt-1 font-['Karla']">
            Only {product.stocksLeft} left in stock
          </p>
        ) : (
          <p className="text-red-600 text-sm mt-1 font-['Karla']">
            Out of Stock
          </p>
        )}

        {/* Admin Actions */}
        <div className="h-12 flex items-center justify-center mt-auto gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Row Component
const ProductRow = ({
  product,
  onEdit,
  onDelete,
  getStockColor,
  formatPrice,
}) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-12 h-12 object-cover rounded-lg mr-3"
            />
            {discountPercent > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                {discountPercent}%
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{product.title}</div>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {/* Price (copied from user ProductCard) */}
        <div className="flex flex-col">
          <span className="text-black line-through">
            ₹{product.originalPrice}
          </span>
          <span className="text-[#f46530] font-bold">
            ₹{product.discountedPrice}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockColor(
            product.stocksLeft
          )}`}
        >
          {product.stocksLeft}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-[#f46530]">
          {"⭐".repeat(Math.ceil(product.rating.rate))}
          <span className="text-gray-500 text-sm">{product.rating.count}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-600 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Product Modal Component (placeholder - you'll need to implement this)
const ProductModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">Product form coming soon...</p>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{product.title}"? This action
            cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
