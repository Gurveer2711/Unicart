import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, email, password, role };

    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-orange-300"
            required
          />

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

          <button
            type="submit"
            className="w-full bg-[#f46530] text-white py-2 rounded-lg transition-colors duration-300 hover:bg-[#d95327] text-center"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?
          <Link to="/login" className="text-[#f46530] hover:underline ml-1">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
