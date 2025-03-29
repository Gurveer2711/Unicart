import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../features/authSlice";
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

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: {
          street: userInfo.address.street || "",
          city: userInfo.address.city || "",
          state: userInfo.address.state || "",
          zipCode: userInfo.address.zipCode || "",
          country: userInfo.address.country || "",
        },
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (activeTab === "orders") {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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

  if (!userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-20 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow rounded-lg p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "profile"
                    ? "text-orange-700"
                    : " hover:bg-gray-100"
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

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Address
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Street
                          </label>
                          <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              City
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              State
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Zip Code
                            </label>
                            <input
                              type="text"
                              name="address.zipCode"
                              value={formData.address.zipCode}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Country
                            </label>
                            <input
                              type="text"
                              name="address.country"
                              value={formData.address.country}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={profileLoading}
                          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
                        >
                          {profileLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>
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
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              Order #{order._id.slice(-6)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              order.isDelivered
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.isDelivered ? "Delivered" : "Processing"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.orderItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.qty}
                                </p>
                              </div>
                              <p className="font-medium">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">Total Amount</p>
                              <p className="font-medium">
                                ${order.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
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
    </div>
  );
};

export default ProfilePage;
