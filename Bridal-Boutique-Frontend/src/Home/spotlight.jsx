import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const Spotlight = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const companyId = params.get("company_id");
        let url = `${API_BASE}/category/get_active_category.php`;
        if (companyId) {
          url += `?company_id=${companyId}`;
        }
        const response = await axios.get(url);
        if (response.data?.status) {
          const categoryData = response.data.data || [];
          setCategories(categoryData);

          if (categoryData.length > 0) {
            const featuredCategoryId = categoryData[0].id;
            const featuredRes = await axios.get(`${API_BASE}/product/get.php?category_id=${featuredCategoryId}&limit=2`);
            setFeaturedProducts(featuredRes.data?.status ? featuredRes.data.data || [] : []);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const featuredCategory = categories[0];

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
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
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

            <div className="rounded-[28px] overflow-hidden border border-[#efe2d0] bg-white shadow-sm">
              <button
                type="button"
                onClick={() => navigate(`/bridal-lehenga?category_id=${featuredCategory?.id || ''}&product_id=${featuredProducts[0]?.id || ''}`)}
                className="block w-full overflow-hidden"
              >
                {featuredCategory?.banner_image ? (
                  <img
                    src={resolveImageUrl(featuredCategory.banner_image)}
                    alt={featuredCategory.name}
                    className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center text-gray-500 bg-[#f6efe8]">
                    No spotlight banner available
                  </div>
                )}
              </button>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[4px] text-[#a97c50]">Featured Edit</p>
                <h3 className="mt-2 text-xl font-semibold text-[#181818]">
                  {featuredCategory?.name || "Latest Bridal Collection"}
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Discover rich fabrics, statement silhouettes, and bridal essentials crafted for unforgettable moments.
                </p>
                <button
                  onClick={() => navigate(`/bridal-lehenga?category_id=${featuredCategory?.id || ''}&product_id=${featuredProducts[0]?.id || ''}`)}
                  className="mt-6 rounded-full bg-[#a97c50] px-6 py-3 text-sm font-semibold uppercase text-white transition hover:bg-[#8a663d]"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Spotlight;