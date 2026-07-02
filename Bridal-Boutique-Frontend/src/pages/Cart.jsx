import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatCurrency } from "../utils/formatters";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toast";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const resolveImageUrl = (src) => {
  if (!src) return "";
  return src.startsWith("http") ? src : `${API_BASE}/${src}`;
};

export default function Cart() {
  const { cartItems, refreshCounts } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  useEffect(() => {
    refreshCounts();
  }, []);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.post(`${API_BASE}/cart/update.php`, {
        id,
        quantity,
      });

      await refreshCounts();
    } catch (err) {
      console.error(err);
      showToast("Unable to update quantity", "error");
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/cart/delete.php?id=${id}`);
      await refreshCounts();
      showToast("Item removed successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Unable to remove item", "error");
    }
  };

  const handleCheckout = () => {
  if (!user) {
    showToast("Please login first", "error");
    setTimeout(() => navigate("/login"), 500);
    return;
  }

  navigate("/checkout", {
    state: {
      fromCart: true,
      cartItems: items,
      subtotal,
      customer_name: user.name || "",
      email: user.email || "",
      mobile: user.phone || "",
      shipping_address: user.address || "",
    },
  });
};

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return (
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 1)
      );
    }, 0);
  }, [items]);

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[2fr_1fr] gap-8">

        {/* Cart Items */}

        <div>
          <h1 className="text-3xl font-semibold uppercase tracking-[4px]">
            Cart
          </h1>

          <div className="mt-6 space-y-4">

            {items.length === 0 ? (
              <div className="rounded-xl bg-white p-6 shadow">
                Your cart is empty.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">

                    <img
                      src={
                        resolveImageUrl(item.image) ||
                        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"
                      }
                      alt={item.product_name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />

                    <div>
                      <h3 className="font-semibold">
                        {item.product_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Number(item.quantity) - 1
                        )
                      }
                      className="h-8 w-8 rounded-full border"
                    >
                      -
                    </button>

                    <span className="w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Number(item.quantity) + 1
                        )
                      }
                      className="h-8 w-8 rounded-full border"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-3 text-red-500 text-sm"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        {/* Order Summary */}

        <div className="rounded-xl bg-white p-6 shadow-sm h-fit">

          <h2 className="text-xl font-semibold">
            Order Summary
          </h2>

          <div className="mt-5 space-y-3">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

          </div>

          <Link
            to="/bridal-lehenga"
            className="block text-center mt-5 text-[#a97c50]"
          >
            Continue Shopping
          </Link>

          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
          >
            Proceed to Checkout
          </button>

        </div>

      </div>
    </div>
  );
}