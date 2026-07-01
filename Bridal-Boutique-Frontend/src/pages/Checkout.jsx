import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { formatCurrency } from "../utils/formatters";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, guestId } = useStore();
  const [form, setForm] = useState({ customer_name: "", email: "", mobile: "", shipping_address: "" });

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0), [cartItems]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${API_BASE}/checkout/place_order.php`, {
      guest_id: guestId(),
      customer_name: form.customer_name,
      email: form.email,
      mobile: form.mobile,
      shipping_address: form.shipping_address,
      total: subtotal,
      items: cartItems,
    });

    if (response.data?.status) {
      navigate("/order-confirmation");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <div className="mt-5 space-y-4">
            <input required className="w-full rounded-md border px-3 py-2" placeholder="Full Name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            <input required className="w-full rounded-md border px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required className="w-full rounded-md border px-3 py-2" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            <textarea required className="min-h-24 w-full rounded-md border px-3 py-2" placeholder="Shipping Address" value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} />
          </div>
          <button className="mt-6 w-full rounded-md bg-[#181818] px-4 py-3 text-white">Place Order</button>
        </form>

        <div className="rounded-xl bg-white p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between"><span>{item.product_name} × {item.quantity}</span><span>{formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}</span></div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 flex justify-between font-semibold text-black"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
        </div>
      </div>
    </div>
  );
}
