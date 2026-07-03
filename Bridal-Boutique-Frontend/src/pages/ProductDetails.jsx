import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingBag, Truck, ChevronLeft, ChevronRight, Play } from "lucide-react";
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
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMediaType, setCurrentMediaType] = useState('video'); // 'video' or 'image'
  const { guestId, refreshCounts, incrementWishlistCount } = useStore();
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

          // If product has video, show video by default
          if (response.data.data.video_url) {
            setCurrentMediaType('video');
          } else {
            setCurrentMediaType('image');
          }

          await axios.post(
            `${API_BASE}/product/increment_view.php`,
            {
              product_id: response.data.data.id
            }
          );
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

  const availableSizes = useMemo(() => {
    if (!product?.available_sizes) return [];
    return product.available_sizes
      .split(/[,;|]/)
      .map((size) => size.trim())
      .filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  const validateSize = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      showToast('Please select a size', 'error');
      return false;
    }
    return true;
  };

  const addToCart = async () => {
    if (!user) {
      showToast('Please log in to add items to cart', 'error');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    if (!validateSize()) {
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/cart/save.php`, {
        guest_id: guestId(),
        product_id: product.id,
        quantity: quantity,
        price: product.price,
        size: selectedSize,
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

    if (!validateSize()) {
      return;
    }

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

  const handleBuyNow = () => {
    if (!user) {
      showToast('Please log in to proceed to payment', 'error');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    const productData = {
      product_id: product.id,
      product_name: product.product_name,
      price: Number(product.price),
      quantity: quantity,
      size: selectedSize,
    };

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

  const nextMedia = () => {
    if (hasVideo && currentMediaType === 'video') {
      // If currently showing video, switch to first image
      setCurrentMediaType('image');
      setCurrentImageIndex(0);
    } else if (images.length > 0) {
      // Navigate through images
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);
      if (nextIndex === 0 && hasVideo) {
        // If we've gone through all images, go back to video
        setCurrentMediaType('video');
      }
    }
  };

  const prevMedia = () => {
    if (hasVideo && currentMediaType === 'image' && currentImageIndex === 0) {
      // If on first image, go back to video
      setCurrentMediaType('video');
    } else if (images.length > 0) {
      // Navigate through images
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(prevIndex);
      setCurrentMediaType('image');
    }
  };

  const convertImagePath = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    let cleanPath = imagePath.replace(/\\/g, "/");
    if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath.substring(8);
    }
    return `${API_BASE}/uploads/${cleanPath}`;
  };

  const convertVideoPath = (videoPath) => {
    if (!videoPath) return null;
    if (videoPath.startsWith("http")) return videoPath;
    let cleanPath = videoPath.replace(/\\/g, "/");
    if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath.substring(8);
    }
    return `${API_BASE}/uploads/${cleanPath}`;
  };

  // Parse gallery images
  let gallery = [];
  if (product?.image_gallery_json) {
    try {
      let cleanJson = product.image_gallery_json;
      if (typeof cleanJson === 'string') {
        cleanJson = cleanJson.replace(/\\\\/g, "").replace(/\\\"/g, '"').replace(/\\\//g, "/");
        gallery = JSON.parse(cleanJson);
      } else if (Array.isArray(cleanJson)) {
        gallery = cleanJson;
      }
    } catch (e) {
      console.warn("Failed to parse image gallery JSON:", e);
      gallery = [];
    }
  }

  // Build images array - include main image and gallery images
  let images = [];
  
  // Add main image
  if (product?.image) {
    images.push(product.image);
  }
  
  // Add gallery images (avoid duplicates)
  if (gallery.length > 0) {
    gallery.forEach(img => {
      if (!images.includes(img)) {
        images.push(img);
      }
    });
  }
  
  // Convert all to URLs and remove nulls
  images = images.filter(Boolean).map(convertImagePath).filter(Boolean);

  // If no images, use default
  if (images.length === 0) {
    images = ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"];
  }

  // Get video URL
  const videoUrl = product?.video_url ? convertVideoPath(product.video_url) : null;
  const hasVideo = !!videoUrl;

  // Get all media items for thumbnail display
  const getAllMediaItems = () => {
    const items = [];
    
    // Add video as first item if exists
    if (hasVideo) {
      items.push({ type: 'video', url: videoUrl, label: 'Video' });
    }
    
    // Add all images
    images.forEach((img, index) => {
      items.push({ type: 'image', url: img, label: `Image ${index + 1}` });
    });
    
    return items;
  };

  const mediaItems = getAllMediaItems();

  // Get current display item
  const getCurrentDisplay = () => {
    if (hasVideo && currentMediaType === 'video') {
      return { type: 'video', url: videoUrl };
    }
    return { type: 'image', url: images[currentImageIndex] || images[0] };
  };

  const currentDisplay = getCurrentDisplay();

  // Get current index for thumbnail highlighting
  const getCurrentThumbnailIndex = () => {
    if (hasVideo && currentMediaType === 'video') {
      return 0;
    }
    return hasVideo ? currentImageIndex + 1 : currentImageIndex;
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

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* Left Column - Media Gallery */}
        <div>
          {/* Main Media Display */}
          <div className="relative bg-black rounded-xl overflow-hidden">
            {currentDisplay.type === 'video' ? (
              <video
                controls
                autoPlay
                muted
                loop
                className="w-full h-[520px] object-contain"
              >
                <source src={currentDisplay.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentDisplay.url}
                alt={`${product.product_name}`}
                className="w-full h-[520px] object-cover"
              />
            )}

            {/* Navigation Arrows */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition z-10"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Media Type Badge */}
            {hasVideo && currentMediaType === 'video' && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Play size={12} fill="white" /> Video
              </div>
            )}
            
            {currentDisplay.type === 'image' && mediaItems.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {getCurrentThumbnailIndex() + 1} / {mediaItems.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery - Shows both video and images */}
          {mediaItems.length > 1 && (
            <div className="mt-4 grid grid-cols-6 gap-2">
              {mediaItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.type === 'video') {
                      setCurrentMediaType('video');
                      setCurrentImageIndex(0);
                    } else {
                      setCurrentMediaType('image');
                      const imageIndex = hasVideo ? index - 1 : index;
                      setCurrentImageIndex(imageIndex);
                    }
                  }}
                  className={`relative rounded-lg overflow-hidden border-2 transition ${
                    (item.type === 'video' && currentMediaType === 'video') ||
                    (item.type === 'image' && currentMediaType === 'image' && 
                      (hasVideo ? currentImageIndex === index - 1 : currentImageIndex === index))
                      ? 'border-[#a97c50]' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="relative h-20 w-full bg-gray-900 flex items-center justify-center">
                      <video
                        src={item.url}
                        className="h-full w-full object-cover opacity-70"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={24} className="text-white" fill="white" />
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded">
                        Video
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-20 w-full object-cover hover:opacity-80 transition"
                    />
                  )}
                  {(item.type === 'video' && currentMediaType === 'video') ||
                   (item.type === 'image' && currentMediaType === 'image' && 
                    (hasVideo ? currentImageIndex === index - 1 : currentImageIndex === index)) && (
                    <div className="absolute inset-0 bg-[#a97c50]/10"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div>
          <p className="text-sm uppercase tracking-[3px] text-[#a97c50]">{product.category_name}</p>
          <h1 className="text-3xl font-semibold mt-2">{product.product_name}</h1>
          <p className="text-gray-600 mt-3">{product.short_description || product.full_description}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
            {product.original_price && (
              <>
                <span className="line-through text-gray-400">{formatCurrency(product.original_price)}</span>
                <span className="text-[#a97c50]">{getDiscountPercent(product.original_price, product.price)}% off</span>
              </>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Total: <span className="font-semibold">{formatCurrency(product.price * quantity)}</span>
          </div>

          {availableSizes.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">Select Size:</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedSize === size ? "border-[#a97c50] bg-[#a97c50] text-white" : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

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
          </div>
        </div>
      </div>
    </div>
  );
}