import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { formatCurrency, getDiscountPercent } from "../utils/formatters";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const resolveImageUrl = (src) => {
  if (!src) return "";
  return src.startsWith("http") ? src : `${API_BASE}/${src}`;
};

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onNavigate,
}) {
  const availableSizes = useMemo(() => {
    if (!product?.available_sizes) return [];

    return product.available_sizes
      .split(/[,;|]/)
      .map((size) => size.trim())
      .filter(Boolean);
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");

  useEffect(() => {
    if (availableSizes.length > 0) {
      setSelectedSize((prev) => prev || availableSizes[0]);
    } else {
      setSelectedSize("");
    }
  }, [availableSizes]);

  const isOutOfStock = Number(product.stock) <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <button
        type="button"
        onClick={onNavigate}
        className="block w-full text-left"
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#f8f8f8]">

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product, selectedSize);
            }}
            className={`absolute top-3 right-3 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-red-50"
            }`}
          >
            <Heart
              size={18}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          {/* Blur Image */}
          <div
            className={`w-full h-full ${
              isOutOfStock ? "blur-[3px]" : ""
            }`}
          >
            {product.video_url ? (
              <video
                src={resolveImageUrl(product.video_url)}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : product.image ? (
              <img
                src={resolveImageUrl(product.image)}
                alt={product.product_name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"
                alt="Default"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Out Of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="bg-black/90 text-white px-7 py-3 rounded-md text-lg font-bold tracking-[3px] shadow-xl">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Content */}
      <div className="p-5">

        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
          {product.product_name}
        </h3>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-semibold">
            {formatCurrency(product.offer_price || product.price)}
          </span>

          {product.offer_price && (
            <span className="line-through text-gray-400">
              {formatCurrency(product.price)}
            </span>
          )}

          {product.offer_price && (
            <span className="text-[#a97c50]">
              {getDiscountPercent(
                product.price,
                product.offer_price
              )}
              % off
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
              4.8 ★
            </span>

            <span className="text-xs text-gray-500">
              ({product.view_count || 0})
            </span>
          </div>

          <span
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : `${product.stock} Left`}
          </span>

        </div>

        {/* <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product, selectedSize)}
          className={`mt-5 w-full flex items-center justify-center gap-2 rounded-md py-2 text-white transition ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#181818] hover:bg-black"
          }`}
        >
          <ShoppingBag size={16} />
          Add to Cart
        </button> */}

      </div>
    </div>
  );
}