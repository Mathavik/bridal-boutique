import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useStore } from "../contexts/StoreContext";
import { formatCurrency } from "../utils/formatters";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { guestId } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ mobile: "", shipping_address: "" });
  const [error, setError] = useState("");

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const productId = params.get("product_id");

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE}/product/get_by_id.php?id=${productId}`);
        if (response.data?.status) {
          setProduct(response.data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
    else setLoading(false);
  }, [user, productId, navigate, location.pathname, location.search]);

  const total = useMemo(() => {
    if (!product) return 0;
    return Number(product.offer_price || product.price || 0);
  }, [product]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!product) {
      setError("Product is not available.");
      return;
    }

    if (!form.mobile || !form.shipping_address) {
      setError("Please enter your mobile number and shipping address.");
      return;
    }

    const response = await axios.post(`${API_BASE}/checkout/place_order.php`, {
      guest_id: guestId(),
      customer_name: user.name,
      email: user.email,
      mobile: form.mobile,
      shipping_address: form.shipping_address,
      total,
      items: [{ product_id: product.id, product_name: product.product_name, price: total, quantity: 1 }],
    });

    if (response.data?.status) {
      navigate("/order-confirmation");
    } else {
      setError(response.data?.message || "Payment failed. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">Loading payment details...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Payment</h1>
          <p className="mt-2 text-sm text-gray-600">Complete your purchase for {product.product_name}.</p>
          {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Order for</div>
              <div className="mt-2 font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required placeholder="Mobile number" className="w-full rounded-md border px-3 py-2" />
            <textarea value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} required placeholder="Shipping address" className="w-full min-h-[120px] rounded-md border px-3 py-2" />
            <button className="w-full rounded-md bg-[#181818] px-4 py-3 text-white">Pay ₹{total.toFixed(2)}</button>
          </form>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-4 text-sm text-gray-600">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="font-semibold">{product.product_name}</div>
              <div className="mt-2">Price: {formatCurrency(total)}</div>
              <div className="mt-1">Quantity: 1</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 bg-[#f8f7f2]">
              <div className="font-semibold">Payment information</div>
              <p className="mt-2 text-sm text-gray-600">After payment success, you will receive an order confirmation and dispatch notification by email within 2 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
