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

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
     <button
  type="button"
  onClick={onNavigate}
  className="block w-full"
>
<div className="relative w-full aspect-[4/5] bg-[#f8f8f8] overflow-hidden"> 
 {product.video_url ? (
<video
    src={resolveImageUrl(product.video_url)}
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay
    muted
    loop
    playsInline
/>
  ) : product.image ? (
<img
    src={resolveImageUrl(product.image)}
    alt={product.product_name}
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
/>
  ) : (
<img
    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"
    alt="Default"
    className="absolute inset-0 w-full h-full object-cover"
/>
  )}
</div>
      </button>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-6">
  {product.product_name}
</h3>
          {/* <span className="text-sm text-[#a97c50]">{product.brand || "Padmavathi Collection"}</span> */}
        </div>

        {/* <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.short_description || product.category_name || "Beautiful bridal wear crafted for the moment."}
        </p> */}
{/* 
        {availableSizes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-full border px-3 py-1 text-xs transition ${selectedSize === size ? "border-[#a97c50] bg-[#a97c50] text-white" : "border-gray-300 bg-white text-gray-700"}`}
              >
                {size}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <span>Sizes: {product.available_sizes || "Custom"}</span>
          </div>
        )} */}

        <div className="mt-4 flex items-center gap-3">
          <span className="font-semibold">{formatCurrency(product.offer_price || product.price)}</span>
          {product.offer_price && product.price ? (
            <span className="line-through text-gray-400">{formatCurrency(product.price)}</span>
          ) : null}
          {product.discount_percentage ? (
            <span className="text-[#a97c50]">{getDiscountPercent(product.price, product.offer_price)}% off</span>
          ) : null}
        </div>

<div className="mt-3 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
      4.8
      <span>★</span>
    </span>

    <span className="text-xs text-gray-500">
  ({product.view_count || 0})
</span>
  </div>

  <span
    className={`text-xs font-medium ${
      product.stock > 0 ? "text-green-600" : "text-red-500"
    }`}
  >
    {product.stock > 0
      ? `${product.stock} Left`
      : "Out of Stock"}
  </span>
</div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onAddToCart(product, selectedSize)}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[#181818] px-3 py-2 text-white"
            type="button"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>

          <button
            onClick={() => onAddToWishlist(product, selectedSize)}
            type="button"
            className={`rounded-md border p-2 ${isWishlisted ? "border-red-200 bg-red-50" : "border-gray-200"}`}
          >
            <Heart size={16} className={isWishlisted ? "text-red-600" : "text-gray-600"} />
          </button>
        </div>
      </div>
    </div>
  );
}
