import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingBag, Share2, Truck, RotateCcw } from "lucide-react";
import { formatCurrency, getDiscountPercent } from "../utils/formatters";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toast";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { guestId, refreshCounts, cartItems, incrementCartCount, incrementWishlistCount } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);

      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/product/get_by_id.php?id=${id}`);
        if (response.data?.status) {
          setProduct(response.data.data);
        } else {
          setError(response.data?.message || "Product not found.");
        }
      } catch (fetchError) {
        console.error("Failed to load product:", fetchError);
        setError("Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      showToast('Please log in to add items to cart', 'error');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/cart/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
        quantity: quantity,
        price: product.price,
      });
      await refreshCounts();
      if (response.data?.status) {
        showToast(`${product.product_name} added to cart successfully`, 'success');
      } else {
        showToast(response.data?.message || "Unable to add to cart", 'error');
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      await refreshCounts();
      showToast("Add to cart failed. Please try again.", 'error');
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      showToast('Please log in to add items to wishlist', 'error');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/wishlist/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
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

  const handleBuyNow = () => {
    if (!user) {
      showToast('Please log in to proceed to payment', 'error');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    // Prepare product data for checkout
    const productData = {
      product_id: product.id,
      product_name: product.product_name,
      price: Number(product.price),
      quantity: quantity,
    };

    // Navigate to checkout with product data
    navigate("/checkout", {
      state: {
        fromProduct: true,
        product: productData,
        customer_name: user.name || "",
        email: user.email || "",
        mobile: user.phone || "",
        shipping_address: user.address || "",
      }
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-28">Loading product...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center pt-28 text-center px-4 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center pt-28">Product not found.</div>;
  }

  const convertImagePath = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f";
    if (imagePath.startsWith("http")) return imagePath;
    let cleanPath = imagePath.replace(/\\/g, "/");
    if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath.substring(8);
    }
    return `${API_BASE}/uploads/${cleanPath}`;
  };

  let gallery = [];
  if (product.image_gallery_json) {
    try {
      const cleanJson = product.image_gallery_json.replace(/\\\\/g, "").replace(/\\\"/g, '"').replace(/\\\//g, "/");
      gallery = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Failed to parse image gallery JSON:", e);
      gallery = [];
    }
  }

  const images = [product.image, ...gallery]
    .filter(Boolean)
    .map(convertImagePath);

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
        <div>
          <img src={images[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"} alt={product.product_name} className="w-full h-[520px] object-cover rounded-xl" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`${product.product_name}-${index}`} className="h-24 w-full object-cover rounded-lg" />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[3px] text-[#a97c50]">{product.category_name}</p>
          <h1 className="text-3xl font-semibold mt-2">{product.product_name}</h1>
          <p className="text-gray-600 mt-3">{product.short_description}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
            {product.original_price && (
              <>
                <span className="line-through text-gray-400">{formatCurrency(product.original_price)}</span>
                <span className="text-[#a97c50]">{getDiscountPercent(product.original_price, product.price)}% off</span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={decrementQuantity}
                className="px-3 py-1 hover:bg-gray-100 transition"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 min-w-[40px] text-center">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="px-3 py-1 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">SKU: {product.product_code || "N/A"} • Barcode: {product.barcode || "N/A"}</div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={addToCart} className="flex items-center gap-2 rounded-md bg-[#181818] px-4 py-3 text-white hover:bg-[#333] transition">
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex items-center gap-2 rounded-md bg-[#a97c50] px-4 py-3 text-white hover:bg-[#8a6540] transition">
              Buy Now
            </button>
            <button onClick={addToWishlist} className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50 transition">
              <Heart size={16} /> Wishlist
            </button>
            <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50 transition">
              <Share2 size={16} /> Share
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-lg">Product Details</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              {product.fabric && <div><span className="font-medium">Fabric:</span> {product.fabric}</div>}
              {product.material && <div><span className="font-medium">Material:</span> {product.material}</div>}
              {product.embroidery && <div><span className="font-medium">Embroidery:</span> {product.embroidery}</div>}
              {product.color && <div><span className="font-medium">Color:</span> {product.color}</div>}
              {product.available_sizes && <div><span className="font-medium">Sizes:</span> {product.available_sizes}</div>}
              {product.occasion && <div><span className="font-medium">Occasion:</span> {product.occasion}</div>}
              {product.unit && <div><span className="font-medium">Unit:</span> {product.unit}</div>}
              {product.gst_percentage && <div><span className="font-medium">GST:</span> {product.gst_percentage}%</div>}
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-start gap-3">
              <Truck className="mt-1" />
              <div>
                <h3 className="font-semibold">Shipping</h3>
                <p className="text-sm text-gray-600">Fast delivery across India.</p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-start gap-3">
              <RotateCcw className="mt-1" />
              <div>
                <h3 className="font-semibold">Returns</h3>
                <p className="text-sm text-gray-600">Easy return policy within 7 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}