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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow rounded-lg p-4 relative min-h-[300px]">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "profile"
                    ? "text-orange-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "orders"
                    ? "text-orange-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                My Orders
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
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
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
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
                      <div className="grid grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-2 gap-4">
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
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {profileLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Orders
                </h2>

                {ordersError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {ordersError}
                  </div>
                )}

                {ordersLoading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No orders found
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition overflow-hidden"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-sm font-medium">
                              Order #{order._id.slice(-6)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>

                        <div className="divide-y">
                          {order.orderItems.map((item) => (
                            <div key={item._id} className="flex py-3 gap-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-16 h-16 object-contain rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">{item.title}</h3>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium">
                                Rs {item.price}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-dashed">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 rounded-full bg-orange-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-orange-600"
                              >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Shipping Address
                              </h4>
                              <address className="not-italic text-sm text-gray-600 leading-relaxed">
                                {order.shippingAddress?.address?.street}, <br />
                                {order.shippingAddress?.address?.city},{" "}
                                {order.shippingAddress?.address?.state}{" "}
                                {order.shippingAddress?.address?.zipCode}
                                <br />
                                {order.shippingAddress?.address?.country}
                              </address>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <span className="text-sm font-semibold text-gray-600">
                            Total
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            Rs {order.totalPrice}
                          </span>
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

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleLogoutCancel}
                className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
