import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useStore } from "../contexts/StoreContext";
import { formatCurrency } from "../utils/formatters";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, guestId, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ 
    customer_name: "", 
    email: "", 
    mobile: "", 
    shipping_address: "" 
  });

  const subtotal = useMemo(() => 
    cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0), 
    [cartItems]
  );

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.name || "",
        email: prev.email || user.email || "",
        mobile: prev.mobile || user.phone || "",
        shipping_address: prev.shipping_address || user.address || "",
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    // Validate form
    if (!form.customer_name || !form.email || !form.mobile || !form.shipping_address) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Prepare order items
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id || item.id,
      product_name: item.product_name || item.name,
      price: Number(item.price),
      quantity: Number(item.quantity)
    }));

    // IMPORTANT: Always send user_id when logged in
    const payload = {
      user_id: user ? user.id : 0,  // This is the key fix
      guest_id: user ? '' : guestId(),  // Only send guest_id if not logged in
      customer_name: form.customer_name,
      email: form.email,
      mobile: form.mobile,
      shipping_address: form.shipping_address,
      total: subtotal,
      items: orderItems,
    };

    console.log("Sending order payload:", payload);

    try {
      const response = await axios.post(`${API_BASE}/checkout/place_order.php`, payload);

      console.log("Order response:", response.data);

      if (response.data?.status) {
        // Clear cart after successful order
        clearCart();
        
        // Navigate to order confirmation
        navigate("/order-confirmation", { 
          state: { 
            orderId: response.data.order_id,
            orderNumber: response.data.order_id
          } 
        });
      } else {
        setError(response.data?.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      console.error("Error response:", error.response?.data);
      setError("An error occurred while placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input 
                required 
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
                placeholder="Full Name" 
                value={form.customer_name} 
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input 
                required 
                type="email"
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
                placeholder="Email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input 
                required 
                type="tel"
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
                placeholder="Mobile Number" 
                value={form.mobile} 
                onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address *
              </label>
              <textarea 
                required 
                className="min-h-24 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
                placeholder="Shipping Address" 
                value={form.shipping_address} 
                onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || cartItems.length === 0}
            className="mt-6 w-full rounded-md bg-[#181818] px-4 py-3 text-white hover:bg-[#333] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        <div className="rounded-xl bg-white p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.product_name || item.name} × {item.quantity}
                </span>
                <span>
                  {formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 border-t pt-4 flex justify-between font-semibold text-black">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          {user && (
            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
              <p>✓ Order will be linked to your account</p>
              <p className="mt-1">You can view your orders in your profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}