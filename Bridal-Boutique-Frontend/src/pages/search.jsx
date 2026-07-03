import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toast";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const parseQuery = (search) => {
  const params = new URLSearchParams(search);
  return {
    q: params.get("q") || "",
    category_id: params.get("category_id") || "",
    min_price: params.get("min_price") || "",
    max_price: params.get("max_price") || "",
    availability: params.get("availability") || "",
  };
};

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { guestId, refreshCounts, wishlistItems, incrementWishlistCount } = useStore();
  const { user } = useAuth();
  const { q, category_id, min_price, max_price, availability } = useMemo(
    () => parseQuery(location.search),
    [location.search]
  );

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(q);
  const [selectedCategory, setSelectedCategory] = useState(category_id);
  const [priceRange, setPriceRange] = useState({ min: min_price, max: max_price });
  const [selectedAvailability, setSelectedAvailability] = useState(availability);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE}/category/get_active_category.php`);
        if (response.data?.status) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Unable to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setSearchText(q);
    setSelectedCategory(category_id);
    setPriceRange({ min: min_price, max: max_price });
    setSelectedAvailability(availability);
  }, [q, category_id, min_price, max_price, availability]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/product/search.php`, {
          params: {
            q: q || "",
            category_id: selectedCategory || 0,
            min_price: priceRange.min || 0,
            max_price: priceRange.max || 0,
            availability: selectedAvailability || "",
          },
        });
        if (response.data?.status) {
          setProducts(response.data.data || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Search request failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q, selectedCategory, priceRange.min, priceRange.max, selectedAvailability]);

  const updateQuery = (updates) => {
    const params = new URLSearchParams(location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value || value === 0) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    navigate({ pathname: "/search", search: params.toString() });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateQuery({ q: searchText.trim(), category_id: selectedCategory, min_price: priceRange.min, max_price: priceRange.max, availability: selectedAvailability });
  };

  const handleAddToCart = async (product, size = "") => {
    if (!user) {
      showToast("Please log in to add items to cart", "error");
      setTimeout(() => navigate("/login"), 500);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/cart/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
        quantity: 1,
        price: product.offer_price || product.price,
        size,
      });
      await refreshCounts();
      if (response.data?.status) {
        showToast("Added to cart successfully", "success");
      } else {
        showToast(response.data?.message || "Unable to add to cart", "error");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      await refreshCounts();
      showToast("Add to cart failed. Please try again.", "error");
    }
  };

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.product_id)),
    [wishlistItems]
  );

  const isWishlisted = (product) => wishlistIds.has(product.id);

  const handleAddToWishlist = async (product, size = "") => {
    if (!user) {
      showToast("Please log in to add items to wishlist", "error");
      setTimeout(() => navigate("/login"), 500);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/wishlist/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
        size,
      });
      if (response.data?.status) {
        incrementWishlistCount(1);
        await refreshCounts();
        showToast("Added to wishlist successfully", "success");
      } else {
        showToast(response.data?.message || "Unable to add to wishlist", "error");
      }
    } catch (error) {
      console.error("Add to wishlist failed:", error);
      showToast("Add to wishlist failed. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Search Results</h1>
          <p className="text-gray-600 mt-2">Showing {products.length} result{products.length !== 1 ? "s" : ""} for "{q || searchText || ""}"</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.8fr_1fr] mb-8">
          <div className="space-y-4">
            <div className="flex gap-3 flex-col lg:flex-row">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products, categories, fabric, color..."
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#a97c50]"
              />
              <button className="rounded-2xl bg-[#a97c50] px-6 py-3 text-white transition hover:bg-[#8a6540]" type="submit">
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-gray-300 bg-white p-4">
                <label className="text-xs font-semibold uppercase text-gray-500">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => updateQuery({ category_id: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-gray-300 bg-white p-4">
                <label className="text-xs font-semibold uppercase text-gray-500">Price</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                    onBlur={() => updateQuery({ min_price: priceRange.min })}
                    placeholder="Min"
                    className="w-1/2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                    onBlur={() => updateQuery({ max_price: priceRange.max })}
                    placeholder="Max"
                    className="w-1/2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-300 bg-white p-4">
                <label className="text-xs font-semibold uppercase text-gray-500">Availability</label>
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuery({ availability: "" })}
                    className={`rounded-xl px-3 py-2 text-sm text-left ${selectedAvailability === "" ? "bg-[#f3eedc]" : "bg-white"}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuery({ availability: "in_stock" })}
                    className={`rounded-xl px-3 py-2 text-sm text-left ${selectedAvailability === "in_stock" ? "bg-[#f3eedc]" : "bg-white"}`}
                  >
                    In Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuery({ availability: "out_of_stock" })}
                    className={`rounded-xl px-3 py-2 text-sm text-left ${selectedAvailability === "out_of_stock" ? "bg-[#f3eedc]" : "bg-white"}`}
                  >
                    Out of Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-96 rounded-xl bg-white animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-600">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={() => navigate(`/product/${product.id}`)}
                onAddToCart={(prod, size) => handleAddToCart(prod, size)}
                onAddToWishlist={(prod, size) => handleAddToWishlist(prod, size)}
                isWishlisted={isWishlisted(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
