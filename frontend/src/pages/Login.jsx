import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8 rounder-lg p-8 shadow-md bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">
          Login to Your Account
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-orange-300"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-orange-300 pr-10"
              required
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
              role="button"
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </span>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-[#f46530] hover:text-[#e55420]"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#f46530] text-white py-2 rounded-lg transition-colors duration-300 hover:bg-[#d95327] text-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          New to UniCart?
          <Link to="/register" className="text-[#f46530] hover:underline ml-1">
            Create Account Now.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
