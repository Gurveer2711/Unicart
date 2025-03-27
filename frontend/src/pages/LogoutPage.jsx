import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const logoutSuccess = !userInfo;

  useEffect(() => {
    if (logoutSuccess) {
      const timer = setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [logoutSuccess, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {logoutSuccess
              ? "Logged Out Successfully"
              : "Log Out of Your Account"}
          </h2>

          {logoutSuccess ? (
            <div className="mt-4">
              <p className="text-center text-md text-gray-600">
                You have been successfully logged out. You will be redirected to
                the homepage in 3 seconds.
              </p>
              <div className="flex justify-center mt-4">
                <Link
                  to="/"
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-center text-md text-gray-600">
                Are you sure you want to log out?
              </p>

              {error && (
                <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleLogout}
                  className={`bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Yes, Log Out"}
                </button>

                <Link
                  to="/"
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
