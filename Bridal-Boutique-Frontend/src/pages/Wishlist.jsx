import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatters";
import { useStore } from "../contexts/StoreContext";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function Wishlist() {
  const { guestId, wishlistItems, refreshCounts } = useStore();
  const [items, setItems] = useState(wishlistItems);

  useEffect(() => {
    setItems(wishlistItems);
  }, [wishlistItems]);

  const removeItem = async (id) => {
    await axios.delete(`${API_BASE}/wishlist/delete.php?id=${id}`);
    refreshCounts();
  };

  const moveToCart = async (product) => {
    await axios.post(`${API_BASE}/cart/save.php`, {
      guest_id: guestId(),
      product_id: product.product_id,
      quantity: 1,
      price: product.offer_price || product.price,
    });
    removeItem(product.id);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold uppercase tracking-[4px]">Wishlist</h1>
        <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.length === 0 ? <div className="rounded-xl bg-white p-6">No wishlist items yet.</div> : items.map((item) => (
            <div key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
              <img src={item.image || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"} alt={item.product_name} className="h-56 w-full rounded-lg object-cover" />
              <h3 className="mt-4 font-semibold">{item.product_name}</h3>
              <p className="text-sm text-gray-500">{formatCurrency(item.offer_price || item.price)}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => moveToCart(item)} className="flex-1 rounded-md bg-[#181818] px-3 py-2 text-white">Move to Cart</button>
                <button onClick={() => removeItem(item.id)} className="rounded-md border px-3 py-2">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
