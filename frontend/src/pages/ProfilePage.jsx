import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserProfile,
  logoutUser,
  forgotPassword,
} from "../features/authSlice";
import { fetchUserOrders } from "../features/orderSlice";
import { useNotification } from "../context/NotificationContext";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword(forgotPasswordEmail)).unwrap();
      addNotification({
        message: "Password reset link sent to your email!",
        type: "success",
        duration: 5000,
      });
      setForgotPasswordEmail("");
    } catch (error) {
      addNotification({
        message: error.message || "Failed to send reset link",
        type: "error",
        duration: 5000,
      });
    }
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Improved responsive design */}
          <div className="w-full lg:w-64 bg-white shadow-lg rounded-xl p-6 relative">
            <div className="flex lg:flex-col gap-1 lg:gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "profile"
                    ? "text-orange-700 border-2 border-orange-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Profile Information
              </button>
              {userInfo?.role !== "admin" && (
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "orders"
                      ? "text-orange-700 border-2 border-orange-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  My Orders
                </button>
              )}
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "password"
                    ? "text-orange-700 border-2 border-orange-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Change Password
              </button>
            </div>
            <div className="mt-6 lg:mt-8 lg:absolute lg:bottom-6 lg:left-6 lg:right-6">
              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content - Improved spacing and layout */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile" ? (
              <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium transition-colors duration-200 shadow-sm"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {profileError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Address
                    </h3>
                    <div className="space-y-6">
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Street Address"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="City"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="State"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Zip Code"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Country"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 font-medium transition-colors duration-200 shadow-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            ) : activeTab === "orders" ? (
              <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                  My Orders
                </h2>
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : ordersError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    {ordersError}
                  </div>
                ) : orders?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <p className="text-gray-400 mt-2">
                      Start shopping to see your orders here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders?.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                          <div>
                            <p className="font-semibold text-lg text-gray-900">
                              Order #{order._id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>

                        {/* Order Items Details */}
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Order Items:
                          </h4>
                          <div className="space-y-3">
                            {order.orderItems?.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 bg-gray-50 rounded-lg p-3"
                              >
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  className="w-12 h-12 object-contain rounded-lg"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">
                                    {item.title}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Price: ₹{item.price?.toFixed(2) || "0.00"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                                    ₹
                                    {(
                                      (item.price || 0) * (item.quantity || 0)
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold text-gray-900">
                              Total: ₹{order.totalPrice?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                  Change Password
                </h2>
                <div className="max-w-lg">
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium shadow-sm"
                      disabled={profileLoading}
                    >
                      {profileLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>

                  <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      What happens next?
                    </h3>
                    <ul className="text-blue-800 space-y-3">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span>
                          You&apos;ll receive an email with a password reset
                          link
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span>The link is valid for 5 minutes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span>Click the link to set a new password</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span>You can then login with your new password</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-8">
              Are you sure you want to logout?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogoutConfirm}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
              >
                Logout
              </button>
              <button
                onClick={handleLogoutCancel}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors duration-200"
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
