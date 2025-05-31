import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, logoutUser } from "../features/authSlice";
import { fetchUserOrders } from "../features/orderSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    userInfo,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.auth);
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.orders);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: {
          street: userInfo.address?.street || "",
          city: userInfo.address?.city || "",
          state: userInfo.address?.state || "",
          zipCode: userInfo.address?.zipCode || "",
          country: userInfo.address?.country || "",
        },
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (activeTab === "orders" && userInfo?._id) {
      dispatch(fetchUserOrders(userInfo._id));
    }
  }, [dispatch, activeTab, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Now responsive */}
          <div className="w-full lg:w-64 bg-white shadow rounded-lg p-4 relative">
            <div className="flex lg:flex-col gap-2 lg:gap-0">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 lg:flex-none text-left px-4 py-2 rounded-md ${
                  activeTab === "profile"
                    ? "bg-orange-50 text-orange-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 lg:flex-none text-left px-4 py-2 rounded-md ${
                  activeTab === "orders"
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                My Orders
              </button>
            </div>
            <div className="mt-4 lg:mt-0 lg:absolute lg:bottom-4 lg:left-4 lg:right-4">
              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" ? (
              <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {profileError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm opacity-70 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Address
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Street"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="City"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="State"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Zip Code"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Country"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  My Orders
                </h2>
                {ordersLoading ? (
                  <div className="text-center py-4">Loading orders...</div>
                ) : ordersError ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {ordersError}
                  </div>
                ) : orders?.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No orders found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders?.map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                          <div>
                            <p className="font-medium">Order #{order._id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Total: ${order.totalAmount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogoutConfirm}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
              <button
                onClick={handleLogoutCancel}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
