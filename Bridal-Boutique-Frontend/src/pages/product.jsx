import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "../components/ProductCard";
import { showToast } from "../utils/toast";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function Product() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { guestId, cartItems, refreshCounts, wishlistItems, incrementCartCount, incrementWishlistCount } = useStore();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE}/category/get_active_category.php`);
        if (response.data?.status) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  const getDefaultSize = (product) => {
    if (!product?.available_sizes) return "";
    const sizes = product.available_sizes
      .split(/[,;|]/)
      .map((size) => size.trim())
      .filter(Boolean);
    return sizes.length > 0 ? sizes[0] : "";
  };

  const addToCart = async (product, size = "") => {
    if (!user) {
      showToast('Please log in to add items to cart', 'error');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    const selectedSize = size || getDefaultSize(product);

    try {
      const response = await axios.post(`${API_BASE}/cart/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
        quantity: 1,
        price: product.offer_price || product.price,
        size: selectedSize,
      });
      await refreshCounts();
      if (response.data?.status) {
        showToast('Added to cart successfully', 'success');
      } else {
        showToast(response.data?.message || 'Unable to add to cart', 'error');
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      await refreshCounts();
      showToast('Add to cart failed. Please try again.', 'error');
    }
  };

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.product_id)),
    [wishlistItems]
  );

  const isWishlisted = (product) => wishlistIds.has(product.id);

  const addToWishlist = async (product, size = "") => {
    if (!user) {
      showToast('Please log in to add items to wishlist', 'error');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    const selectedSize = size || getDefaultSize(product);

    try {
      const response = await axios.post(`${API_BASE}/wishlist/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
        size: selectedSize,
      });
      if (response.data?.status) {
        incrementWishlistCount(1);
        await refreshCounts();
        showToast('Added to wishlist successfully', 'success');
      } else {
        showToast(response.data?.message || 'Unable to add to wishlist', 'error');
      }
    } catch (error) {
      console.error("Add to wishlist failed:", error);
      showToast('Add to wishlist failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 rounded-xl bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={() => window.location.assign(`/product/${product.id}`)}
                onAddToCart={(prod, size) => addToCart(prod, size)}
                onAddToWishlist={(prod, size) => addToWishlist(prod, size)}
                isWishlisted={isWishlisted(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
