import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home/Home";
import Footer from "./components/Footer";
import Product from "./pages/product";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import ScrollToTop from "./components/ScrollToTop";
import PaymentSuccess from "./pages/PaymentSuccess";
import InvoicePage from "./pages/InvoicePage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bridal-lehenga" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />
        

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}