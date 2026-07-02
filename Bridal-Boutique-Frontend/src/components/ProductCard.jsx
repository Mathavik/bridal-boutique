import { useState } from "react";
import { Heart, ShoppingBag, Play, X } from "lucide-react";
import { formatCurrency, getDiscountPercent } from "../utils/formatters";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend";

const resolveImageUrl = (src) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("uploads/")) {
    return `${API_BASE}/${src}`;
  }
  return `${API_BASE}/uploads/${src}`;
};

const resolveVideoUrl = (src) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("uploads/")) {
    return `${API_BASE}/${src}`;
  }
  return `${API_BASE}/uploads/${src}`;
};

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onNavigate,
}) {
  const [showVideo, setShowVideo] = useState(false);

  const imageUrl = product.image 
    ? resolveImageUrl(product.image) 
    : "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0";

  const hasVideo = product.video_url && product.video_url.trim() !== "";
  const videoUrl = hasVideo ? resolveVideoUrl(product.video_url) : "";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onNavigate}
        className="block w-full overflow-hidden relative group"
      >
        <img
          src={imageUrl}
          alt={product.product_name}
          className="w-full h-80 object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0";
          }}
        />
        
        {/* Video Play Button Overlay */}
        {hasVideo && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div 
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition transform group-hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setShowVideo(true);
              }}
            >
              <Play className="w-8 h-8 text-[#181818] ml-1" />
            </div>
          </div>
        )}
      </button>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{product.product_name}</h3>
          <span className="text-sm text-[#a97c50]">{product.brand || "Padmavathi Collection"}</span>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.short_description || product.category_name || "Beautiful bridal wear crafted for the moment."}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <span>Sizes: {product.available_sizes || "Custom"}</span>
          {hasVideo && (
            <span className="ml-2 text-xs text-blue-600 flex items-center gap-1">
              <Play size={12} /> Video
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-semibold">{formatCurrency(product.offer_price || product.price)}</span>
          {product.offer_price && product.price && product.offer_price < product.price ? (
            <span className="line-through text-gray-400">{formatCurrency(product.price)}</span>
          ) : null}
          {product.discount_percentage ? (
            <span className="text-[#a97c50]">{getDiscountPercent(product.price, product.offer_price)}% off</span>
          ) : null}
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Rating: 4.8 • Stock: {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[#181818] px-3 py-2 text-white hover:bg-[#333] transition"
            type="button"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>

          <button
            onClick={onAddToWishlist}
            type="button"
            className={`rounded-md border p-2 transition ${isWishlisted ? "border-red-200 bg-red-50" : "border-gray-200 hover:bg-gray-50"}`}
          >
            <Heart size={16} className={isWishlisted ? "text-red-600" : "text-gray-600"} />
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && hasVideo && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X size={32} />
            </button>
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg max-h-[80vh]"
              controlsList="nodownload"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}