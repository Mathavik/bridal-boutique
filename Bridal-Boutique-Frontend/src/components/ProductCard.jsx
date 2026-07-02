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
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onNavigate}
        className="block w-full overflow-hidden"
      >
        <img
          src={resolveImageUrl(product.image || "") || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"}
          alt={product.product_name}
          className="w-full h-80 object-cover"
        />
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
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-semibold">{formatCurrency(product.offer_price || product.price)}</span>
          {product.offer_price && product.price ? (
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
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[#181818] px-3 py-2 text-white"
            type="button"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>

          <button
            onClick={onAddToWishlist}
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
