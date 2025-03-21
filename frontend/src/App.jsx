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

function Layout() {
  const location = useLocation();
  const hideNavbarFooter =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
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
