import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatCurrency } from "../utils/formatters";
import { useStore } from "../contexts/StoreContext";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const resolveImageUrl = (src) => {
  if (!src) return "";
  return src.startsWith("http") ? src : `${API_BASE}/${src}`;
};

export default function Cart() {
  const { cartItems, refreshCounts } = useStore();
  const [items, setItems] = useState(cartItems);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    await axios.post(`${API_BASE}/cart/update.php`, { id, quantity });
    await refreshCounts();
  };

  const removeItem = async (id) => {
    await axios.delete(`${API_BASE}/cart/delete.php?id=${id}`);
    await refreshCounts();
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0), [items]);

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <h1 className="text-3xl font-semibold uppercase tracking-[4px]">Cart</h1>
          <div className="mt-6 space-y-4">
            {items.length === 0 ? <div className="rounded-xl bg-white p-6">Your cart is empty.</div> : items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={resolveImageUrl(item.image || "") || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"} alt={item.product_name} className="h-24 w-24 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <button onClick={() => updateQuantity(item.id, Number(item.quantity || 1) - 1)} className="h-8 w-8 rounded-full border">−</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, Number(item.quantity || 1) + 1)} className="h-8 w-8 rounded-full border">+</button>
                  <button onClick={() => removeItem(item.id)} className="ml-3 text-sm text-red-500">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between font-semibold text-black"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
          </div>
          <Link to="/checkout" className="mt-6 block w-full rounded-md bg-[#181818] px-4 py-3 text-center text-white">Proceed to Checkout</Link>
          <Link to="/bridal-lehenga" className="mt-3 block text-center text-sm text-[#a97c50]">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
