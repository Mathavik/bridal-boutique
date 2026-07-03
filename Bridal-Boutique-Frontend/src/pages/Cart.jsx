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
  if (src.startsWith("http")) return src;
  let cleanPath = src.replace(/\\/g, "/");
  if (cleanPath.startsWith("uploads/")) {
    cleanPath = cleanPath.substring(8);
  }
  return `${API_BASE}/uploads/${cleanPath}`;
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
        Number(item.price || 0) * Number(item.quantity || 1)
      );
    }, 0);
  }, [items]);

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[2fr_1fr] gap-8">

        {/* Cart Items */}
        <div>
          <h1 className="text-3xl font-semibold uppercase tracking-[4px]">
            Cart ({items.length})
          </h1>

          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-xl bg-white p-6 shadow text-center">
                <p className="text-gray-500">Your cart is empty.</p>
                <Link to="/products" className="mt-4 inline-block text-[#a97c50] hover:underline">
                  Continue Shopping →
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Image container with object-contain to show full image */}
                    <div className="h-24 w-24 rounded-lg overflow-hidden bg-[#f8f7f2] flex items-center justify-center flex-shrink-0">
                      <img
                        src={
                          resolveImageUrl(item.image) ||
                          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"
                        }
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {item.product_name}
                      </h3>
                      <p className="text-sm font-medium text-[#a97c50]">
                        {formatCurrency(item.price)}
                      </p>
                      {item.size && (
                        <span className="inline-flex items-center rounded-full bg-[#f0f0f0] px-3 py-1 text-xs font-medium text-gray-700 mt-1">
                          Size: {item.size}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Number(item.quantity) - 1
                          )
                        }
                        className="h-8 w-8 rounded-full border hover:bg-gray-50 transition flex items-center justify-center"
                        disabled={Number(item.quantity) <= 1}
                      >
                        -
                      </button>

                      <span className="w-6 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Number(item.quantity) + 1
                          )
                        }
                        className="h-8 w-8 rounded-full border hover:bg-gray-50 transition flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-sm hover:text-red-700 transition ml-2"
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
        {items.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow-sm h-fit sticky top-28">
            <h2 className="text-xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <Link
              to="/products"
              className="block text-center mt-5 text-[#a97c50] hover:underline"
            >
              Continue Shopping
            </Link>

            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-[#181818] text-white py-3 rounded-md hover:bg-[#333] transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}