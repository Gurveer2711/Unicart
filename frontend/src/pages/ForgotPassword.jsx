import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/authSlice";
import { useNotification } from "../context/NotificationContext";
import { clearMessage, clearError } from "../features/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.auth);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (message) {
      addNotification({ message, type: "success" });
      dispatch(clearMessage());
    }
    if (error) {
      addNotification({ message: error, type: "error" });
      dispatch(clearError());
    }
  }, [message, error, addNotification, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-orange-300"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#f46530] text-white py-2 rounded-lg transition-colors duration-300 hover:bg-[#d95327] text-center"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
