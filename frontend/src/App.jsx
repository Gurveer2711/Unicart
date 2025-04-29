import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./features/authSlice.js";
import LogoutPage from "./pages/LogoutPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const includedPaths = [
      "/profile",
      "/checkout",
      "/cart",
      "/",
      "/checkout",
      "/products",
      "/product/:id",
    ];
    if (includedPaths.includes(location.pathname)) {
      dispatch(checkAuth());
    }
  }, [dispatch, location.pathname]);

  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout />
      </Router>
    </Provider>
  );
}

export default App;
