import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingBag, Share2, Truck, RotateCcw } from "lucide-react";
import { formatCurrency, getDiscountPercent } from "../utils/formatters";
import { useStore } from "../contexts/StoreContext";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { guestId, refreshCounts } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`${API_BASE}/product/get_by_id.php?id=${id}`);
      if (response.data?.status) {
        setProduct(response.data.data);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const response = await axios.post(`${API_BASE}/cart/save.php`, {
      guest_id: guestId(),
      product_id: product.id,
      quantity: 1,
      price: product.offer_price || product.price,
    });
    if (response.data?.status) {
      await refreshCounts();
    }
  };

  const addToWishlist = async () => {
    const response = await axios.post(`${API_BASE}/wishlist/save.php`, {
      guest_id: guestId(),
      product_id: product.id,
    });
    if (response.data?.status) {
      await refreshCounts();
    }
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center pt-28">Loading product...</div>;
  }

  const gallery = product.image_gallery_json ? JSON.parse(product.image_gallery_json) : [];
  const images = [product.image, ...gallery].filter(Boolean);

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
            <span className="text-2xl font-semibold">{formatCurrency(product.offer_price || product.price)}</span>
            <span className="line-through text-gray-400">{formatCurrency(product.price)}</span>
            <span className="text-[#a97c50]">{getDiscountPercent(product.price, product.offer_price)}% off</span>
          </div>
          <div className="mt-4 text-sm text-gray-500">SKU: {product.sku || "N/A"} • Brand: {product.brand || "BOTIK"}</div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={addToCart} className="flex items-center gap-2 rounded-md bg-[#181818] px-4 py-3 text-white"><ShoppingBag size={16} /> Add to Cart</button>
            <button onClick={() => navigate(`/payment?product_id=${product.id}`)} className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-3">Buy Now</button>
            <button onClick={addToWishlist} className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-3"><Heart size={16} /> Wishlist</button>
            <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-3"><Share2 size={16} /> Share</button>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-lg">Product Details</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div><span className="font-medium">Fabric:</span> {product.fabric}</div>
              <div><span className="font-medium">Material:</span> {product.material}</div>
              <div><span className="font-medium">Pattern:</span> {product.pattern}</div>
              <div><span className="font-medium">Color:</span> {product.color}</div>
              <div><span className="font-medium">Sizes:</span> {product.available_sizes}</div>
              <div><span className="font-medium">Occasion:</span> {product.occasion}</div>
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
