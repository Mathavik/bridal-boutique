import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingBag } from "lucide-react";
import { formatCurrency, getDiscountPercent } from "../utils/formatters";
import { useStore } from "../contexts/StoreContext";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const resolveImageUrl = (src) => {
  if (!src) return "";
  return src.startsWith("http") ? src : `${API_BASE}/${src}`;
};

export default function BridalLehenga() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { guestId, refreshCounts, wishlistItems } = useStore();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get("category_id");
        const productId = params.get("product_id");

        let url = `${API_BASE}/product/get.php?limit=20`;
        if (categoryId) {
          url = `${API_BASE}/product/get.php?category_id=${categoryId}&limit=20`;
        } else if (productId) {
          url = `${API_BASE}/product/get.php?id=${productId}`;
        }

        const response = await axios.get(url);
        if (response.data?.status) {
          const data = response.data.data || [];
          setProducts(Array.isArray(data) ? data : [data]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const addToCart = async (product) => {
    try {
      const response = await axios.post(`${API_BASE}/cart/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
        quantity: 1,
        price: product.offer_price || product.price,
      });
      if (response.data?.status) {
        await refreshCounts();
        alert("Added to cart");
      } else {
        alert(response.data?.message || "Unable to add to cart");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Add to cart failed. Please try again.");
    }
  };

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.product_id)),
    [wishlistItems]
  );

  const isWishlisted = (product) => wishlistIds.has(product.id);

  const addToWishlist = async (product) => {
    try {
      const response = await axios.post(`${API_BASE}/wishlist/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
      });
      if (response.data?.status) {
        await refreshCounts();
        alert("Added to wishlist");
      } else {
        alert(response.data?.message || "Unable to add to wishlist");
      }
    } catch (error) {
      console.error("Add to wishlist failed:", error);
      alert("Add to wishlist failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold uppercase tracking-[4px]">Bridal Lehenga</h1>
          <p className="text-gray-600 mt-2">Discover handcrafted bridal wear curated from our latest collection.</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 rounded-xl bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img src={resolveImageUrl(product.image || "") || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"} alt={product.product_name} className="w-full h-80 object-cover" />
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{product.product_name}</h3>
                    <span className="text-sm text-[#a97c50]">{product.brand || "Padmavathi Collection"}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.short_description}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <span>Sizes: {product.available_sizes || "Custom"}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="font-semibold">{formatCurrency(product.offer_price || product.price)}</span>
                    <span className="line-through text-gray-400">{formatCurrency(product.price)}</span>
                    <span className="text-[#a97c50]">{getDiscountPercent(product.price, product.offer_price)}% off</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">Rating: 4.8 • Stock: {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}</div>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => addToCart(product)} className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[#181818] px-3 py-2 text-white">
                      <ShoppingBag size={16} /> Add to Cart
                    </button>
                    <button
                      onClick={() => addToWishlist(product)}
                      className={`rounded-md border p-2 ${isWishlisted(product) ? "border-red-200 bg-red-50" : "border-gray-200"}`}
                    >
                      <Heart size={16} className={isWishlisted(product) ? "text-red-600" : "text-gray-600"} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
