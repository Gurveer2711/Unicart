import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../features/cartSlice";
import { Shield, ArrowLeft } from "lucide-react";
import { createOrder } from "../features/orderSlice";
import { clearCart } from "../features/cartSlice";
import { useNotification } from "../context/NotificationContext";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const { userInfo } = useSelector((state) => state.auth);
  const { items, loading: cartLoading } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        street: userInfo.address.street || "",
        city: userInfo.address.city || "",
        state: userInfo.address.state || "",
        zipCode: userInfo.address.zipCode || "",
        country: userInfo.address.country || "",
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + item.productId.discountedPrice * item.quantity,
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        title: item.productId.title,
        quantity: item.quantity,
        image: item.productId.image,
        price: item.productId.discountedPrice,
        product: item.productId._id,
      }));

      const shippingAddress = {
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };

      const itemsPrice = calculateTotal();
      const shippingPrice = 0;
      const taxPrice = Math.round(itemsPrice * 0.1);
      const totalPrice = itemsPrice + taxPrice;

      const orderPayload = {
        user: userInfo._id,
        orderItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const resultAction = await dispatch(createOrder(orderPayload));

      if (createOrder.fulfilled.match(resultAction)) {
        dispatch(clearCart());
        addNotification({
          message: "Order created successfully! Redirecting to your profile...",
          type: "success",
          duration: 3000,
        });
        navigate("/profile");
      } else {
        throw new Error(
          resultAction.payload?.message || "Failed to create order"
        );
      }
    } catch (error) {
      addNotification({
        message: error,
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f46530] border-t-transparent"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Karla']">
            Your cart is empty
          </h1>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#f46530] text-white px-6 py-2 rounded-lg hover:bg-[#e55420] transition-colors font-['Karla']"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center text-gray-600 hover:text-[#f46530] transition-colors font-['Karla']"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Progress Steps */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#f46530] text-white rounded-full flex items-center justify-center">
                     1
                </div>
                  <span className="ml-3 font-medium">Shipping</span>
                 </div>
                 <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                     2
                </div>
                 <span className="ml-3 font-medium text-gray-500">
              Payment
                  </span>
                 </div>
               </div>
             </div> */}

            {/* Shipping Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 font-['Karla']">
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-['Karla']">
                      Street
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f46530] focus:border-transparent transition-colors"
                      placeholder="Enter your street address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-['Karla']">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f46530] focus:border-transparent transition-colors"
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-['Karla']">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f46530] focus:border-transparent transition-colors"
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-['Karla']">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f46530] focus:border-transparent transition-colors"
                      placeholder="Enter postal code"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-['Karla']">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f46530] focus:border-transparent transition-colors"
                      placeholder="Enter your country"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 font-['Karla']">
                  <Shield className="w-5 h-5" />
                  <span>Your information is secure and encrypted</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#f46530] text-white py-3 rounded-lg hover:bg-[#e55420] transition-colors flex items-center justify-center space-x-2 font-['Karla']"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5" />
                      <span>Proceed to Order</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 font-['Karla']">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={item.productId.image}
                      alt={item.productId.title}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium font-['Karla']">
                        {item.productId.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-['Karla']">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium font-['Karla']">
                      ₹{item.productId.discountedPrice * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 font-['Karla']">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-['Karla']">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between font-semibold text-lg pt-2 border-t font-['Karla']">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
