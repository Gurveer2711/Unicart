import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);


forgotPassword();
  const handleSubmit = (e) => {
    e.preventDefault();
      dispatch(forgotPassword(email));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

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
