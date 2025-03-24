import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, User, LogOut, LogIn } from "lucide-react"; // Importing icons
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);

  // Calculate total quantity of items in cart
  const cartItemCount =
    cartItems?.reduce((count, item) => count + item.quantity, 0) || 0;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="font-inter bg-[#fff2dd] w-full fixed top-0 left-0 shadow-md z-50 h-[70px] sm:h-auto">
      <div className="mx-auto flex justify-between items-center px-6 mb-5">
        {/* Logo */}
        <NavLink to="/">
          <img
            src="/logoHeading2.png"
            alt="Logo"
            className="absolute -mt-10 -ml-3 sm:-mt-8 h-[100px] w-auto z-10"
          />
        </NavLink>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={toggleMenu}
          className="sm:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="mt-5 w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex space-x-6 mt-9 px-10 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative text-lg font-semibold text-black after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#f46530] after:transition-all after:duration-300 ${
                isActive ? "after:w-full text-[#f46530]" : "after:w-0"
              } hover:after:w-full`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `relative text-lg font-semibold text-black after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#f46530] after:transition-all after:duration-300 ${
                isActive ? "after:w-full text-[#f46530]" : "after:w-0"
              } hover:after:w-full`
            }
          >
            Products
          </NavLink>

          {/* Cart with Badge */}
          <NavLink to="/cart" className="relative">
            <ShoppingCart className="w-7 h-7 text-black hover:text-[#f46530]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#f46530] text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </NavLink>
          {/* Auth Links */}
          {userInfo ? (
            <>
              {/* User Profile Button */}
              <NavLink
                to="/profile"
                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
                {userInfo.role === "admin" && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                    Admin
                  </span>
                )}
              </NavLink>

              {/* Admin Dashboard Button - Only shown for admin users */}
              {userInfo.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="font-medium">Dashboard</span>
                </NavLink>
              )}

              {/* Logout Button */}
              <NavLink
                to="/logout"
                className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-[#fff2dd] transform transition-transform duration-300 ease-in-out z-40 sm:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <button
            onClick={toggleMenu}
            className="focus:outline-none transition-transform duration-300 ease-in-out"
            aria-label="Close Menu"
          >
            <svg
              className={`w-8 h-8 text-black transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="flex flex-col items-center space-y-6 mt-10">
          <NavLink
            to="/"
            onClick={toggleMenu}
            className="text-lg font-semibold text-black"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={toggleMenu}
            className="text-lg font-semibold text-black"
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            onClick={toggleMenu}
            className="text-lg font-semibold text-black flex items-center gap-2"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="bg-[#f46530] text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </NavLink>

          {userInfo ? (
            <>
              <NavLink
                to="/profile"
                onClick={toggleMenu}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold"
              >
                <User className="w-5 h-5" />
                Profile
                {userInfo.role === "admin" && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                    Admin
                  </span>
                )}
              </NavLink>

              {userInfo.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={toggleMenu}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold"
                >
                  Dashboard
                </NavLink>
              )}

              <NavLink
                to="/logout"
                onClick={toggleMenu}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={toggleMenu}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold"
              >
                <LogIn className="w-5 h-5" />
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={toggleMenu}
                className="text-lg font-semibold text-black"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
