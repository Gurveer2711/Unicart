import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#fff2dd] text-black font-inter">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              At <span className="font-libre font-semibold text-md">UniCart</span>, we bring you a seamless shopping
              experience with high-quality products, unbeatable deals, and
              exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm">
              <li className="mb-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `font-semibold text-black ${
                      isActive ? "text-[#f46530]" : ""
                    } hover:text-[#f46530]`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `font-semibold text-black ${
                      isActive ? "text-[#f46530]" : ""
                    } hover:text-[#f46530]`
                  }
                >
                  Products
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `font-semibold text-black ${
                      isActive ? "text-[#f46530]" : ""
                    } hover:text-[#f46530]`
                  }
                >
                  Cart
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `font-semibold text-black ${
                      isActive ? "text-[#f46530]" : ""
                    } hover:text-[#f46530]`
                  }
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="text-sm">
              <li className="mb-2">
                <NavLink
                  to="/privacy-policy"
                  className={({ isActive }) =>
                    `font-semibold text-black ${
                      isActive ? "text-[#f46530]" : ""
                    } hover:text-[#f46530]`
                  }
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/terms-and-conditions"
                  className={({ isActive }) =>
                    `font-semibold text-black ${
                      isActive ? "text-[#f46530]" : ""
                    } hover:text-[#f46530]`
                  }
                >
                  Terms and Conditions
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/singh_gurveerr?igsh=c20yYWVvdHRlOGsw"
                className="hover:opacity-75"
                aria-label="Instagram"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                  alt="Instagram"
                  className="w-6 h-6"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/gurveer27/"
                className="hover:opacity-75"
                aria-label="LinkedIn"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
                  alt="LinkedIn"
                  className="w-6 h-6"
                />
              </a>
              <a
                href="https://x.com/gurveer35731437"
                className="hover:opacity-75"
                aria-label="X (Twitter)"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                  alt="X (Twitter)"
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-gray-300"></div>

      {/* Copyright and Payment Methods */}
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Copyright Section */}
        <p className="text-sm text-gray-600 flex items-center space-x-2">
          <span>© {new Date().getFullYear()}</span>
          <a
            href="https://github.com/Gurveer2711"
            className="hover:opacity-75"
            aria-label="GitHub"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
              alt="GitHub"
              className="w-6 h-6"
            />
          </a>
          <span>Gurveer2711. All rights reserved.</span>
        </p>

        {/* Payment Methods Section */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <span className="font-libre font-bold">We accept</span>
          <a href="#" className="hover:opacity-75" aria-label="Visa">
            <img
              src="https://imgs.search.brave.com/g4Tw6mlkuzrWQWUH0NcdanwHpx-rNn_h3LZMldnKpIs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pY29u/cy5pY29uYXJjaGl2/ZS5jb20vaWNvbnMv/ZGVzaWduYm9sdHMv/Y3JlZGl0LWNhcmQt/cGF5bWVudC8yNTYv/VmlzYS1pY29uLnBu/Zw"
              alt="Visa"
              className="w-8 h-8"
            />
          </a>
          <a href="#" className="hover:opacity-75" aria-label="Mastercard">
            <img
              src="https://imgs.search.brave.com/HtHWZ7mian2xFG1lxWOOzugdLC6jqfszl7w3jvsyWbE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvbWFzdGVyY2Fy/ZC9tYXN0ZXJjYXJk/X1BORzI1LnBuZw"
              alt="Mastercard"
              className="w-8 h-8"
            />
          </a>
          <a href="#" className="hover:opacity-75" aria-label="PayPal">
            <img
              src="https://cdn-icons-png.flaticon.com/512/174/174861.png"
              alt="PayPal"
              className="w-8 h-8"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
