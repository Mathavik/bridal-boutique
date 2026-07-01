import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const Spotlight = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [gownProducts, setGownProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const companyId = params.get("company_id") || "47";
        const response = await axios.get(`${API_BASE}/category/get_active_category.php?company_id=${companyId}`);
        if (response.data?.status) {
          const categoryData = response.data.data || [];
          setCategories(categoryData);

          if (categoryData.length > 0) {
            const featuredCategoryId = categoryData[0].id;
            const gownCategory = categoryData.find((category) => category.name?.toLowerCase().includes("gown")) || categoryData[1] || categoryData[0];
            const gownCategoryId = gownCategory?.id || featuredCategoryId;

            const [featuredRes, gownRes] = await Promise.all([
              axios.get(`${API_BASE}/product/get.php?category_id=${featuredCategoryId}&limit=2`),
              axios.get(`${API_BASE}/product/get.php?category_id=${gownCategoryId}&limit=2`),
            ]);

            setFeaturedProducts(featuredRes.data?.status ? featuredRes.data.data || [] : []);
            setGownProducts(gownRes.data?.status ? gownRes.data.data || [] : []);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const featuredCategory = categories[0];
  const gownCategory = categories.find((category) => category.name?.toLowerCase().includes("gown")) || categories[1] || categories[0];
  const secondaryCategory = gownCategory || categories[1] || categories[0];

  const resolveImageUrl = (src) => {
    if (!src) return "";
    return src.startsWith("http") ? src : `${API_BASE}/${src}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[6px] text-[#a97c50]">Curated For Celebrations</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[4px] uppercase sm:text-4xl">
          In The Spotlight
        </h2>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[420px] rounded-[28px] bg-gray-100 animate-pulse" />
          <div className="grid gap-4">
            <div className="h-24 rounded-[24px] bg-gray-100 animate-pulse" />
            <div className="h-24 rounded-[24px] bg-gray-100 animate-pulse" />
            <div className="h-24 rounded-[24px] bg-gray-100 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProducts.map((product) => (
                <div key={product.id} className="rounded-[28px] overflow-hidden border border-[#efe2d0] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => navigate(`/bridal-lehenga?category_id=${featuredCategory?.id || ''}&product_id=${product.id}`)}
                    className="block w-full overflow-hidden"
                  >
                    <img
                      src={resolveImageUrl(product.image || "") || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"}
                      alt={product.product_name}
                      className="h-72 w-full object-cover transition duration-200 hover:scale-[1.01]"
                    />
                  </button>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[3px] text-[#a97c50]">{featuredCategory?.name || "Lehenga"}</p>
                    <h4 className="mt-2 text-lg font-semibold text-[#181818]">{product.product_name}</h4>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span>₹{product.offer_price || product.price}</span>
                      {product.discount_percentage ? (
                        <span className="line-through">₹{product.price}</span>
                      ) : null}
                      {product.discount_percentage ? <span className="text-[#a97c50]">{product.discount_percentage}% OFF</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="group relative overflow-hidden rounded-[32px] bg-[#f6efe8] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="h-[420px] w-full">
                {featuredCategory?.banner_image ? (
                  <img
                    src={resolveImageUrl(featuredCategory.banner_image)}
                    alt={featuredCategory.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    No spotlight banner available
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <p className="text-sm uppercase tracking-[4px] text-[#f3d7b8]">Featured Edit</p>
                <h3 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  {featuredCategory?.name || "Latest Bridal Collection"}
                </h3>
                <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
                  Discover rich fabrics, statement silhouettes, and bridal essentials crafted for unforgettable moments.
                </p>
                <button
                  onClick={() => navigate(`/bridal-lehenga?category_id=${featuredCategory?.id || ''}&product_id=${featuredProducts[0]?.id || ''}`)}
                  className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-[#181818] transition hover:bg-[#a97c50] hover:text-white"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="group relative overflow-hidden rounded-[32px] bg-[#f6efe8] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="h-[420px] w-full">
                {secondaryCategory?.banner_image ? (
                  <img
                    src={resolveImageUrl(secondaryCategory.banner_image)}
                    alt={secondaryCategory.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    No secondary banner available
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <p className="text-sm uppercase tracking-[4px] text-[#f3d7b8]">For Every Occasion</p>
                <h3 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  {secondaryCategory?.name || "Gowns"}
                </h3>
                <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
                  {secondaryCategory?.name ? `Explore our ${secondaryCategory.name} collection with a fresh curated banner.` : "Discover elegant silhouettes for your next celebration."}
                </p>
                <button
                  onClick={() => navigate(`/bridal-lehenga?category_id=${secondaryCategory?.id || ''}&product_id=${gownProducts[0]?.id || ''}`)}
                  className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-[#181818] transition hover:bg-[#a97c50] hover:text-white"
                >
                  View Collection
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-rows-2">
              {gownProducts.map((product) => (
                <div key={product.id} className="rounded-[28px] overflow-hidden border border-[#efe2d0] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => navigate(`/bridal-lehenga?category_id=${secondaryCategory?.id || ''}&product_id=${product.id}`)}
                    className="block w-full overflow-hidden"
                  >
                    <img
                      src={resolveImageUrl(product.image || "") || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"}
                      alt={product.product_name}
                      className="h-48 w-full object-cover transition duration-200 hover:scale-[1.01]"
                    />
                  </button>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[3px] text-[#a97c50]">{secondaryCategory?.name || "Gowns"}</p>
                    <h4 className="mt-2 text-lg font-semibold text-[#181818]">{product.product_name}</h4>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span>₹{product.offer_price || product.price}</span>
                      {product.discount_percentage ? (
                        <span className="line-through">₹{product.price}</span>
                      ) : null}
                      {product.discount_percentage ? <span className="text-[#a97c50]">{product.discount_percentage}% OFF</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Spotlight;