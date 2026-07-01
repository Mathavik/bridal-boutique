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
      } catch (error) {
        console.error("Error fetching spotlight data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const featuredCategory = categories[0];
  const gownCategory = categories.find((category) => category.name?.toLowerCase().includes("gown")) || categories[1] || categories[0];
  const secondaryCategory = gownCategory || categories[1] || categories[0];
  const gownCategories = categories.filter((category) => category.name?.toLowerCase().includes("gown"));
  const bannerCategory = gownCategories[0] || categories[1] || categories[0];

  const resolveImageUrl = (src) => {
    if (!src) return "";
    return src.startsWith("http") ? src : `${API_BASE}/${src}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[6px] text-[#a97c50]">Curated For Celebrations</p>
        <h2 className="mt-3 text-3xl font-medium tracking-[4px] uppercase sm:text-4xl">
          In The Spotlight
        </h2>
      </div>

      {loading ? (
        <div className="space-y-12">
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <div className="grid grid-cols-2 gap-4"><div className="h-[350px] bg-gray-100 animate-pulse" /><div className="h-[350px] bg-gray-100 animate-pulse" /></div>
            <div className="h-[450px] bg-gray-100 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section 1: 2 Products Left, 1 Big Banner Right */}
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex flex-col bg-white group cursor-pointer">
                  <div className="overflow-hidden bg-gray-50 aspect-[3/4]">
                    <img
                      src={resolveImageUrl(product.image || "") || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"}
                      alt={product.product_name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
                    />
                  </div>
                  <div className="pt-3 pb-2 text-left">
                    <h4 className="text-[14px] font-medium text-[#181818] tracking-wide truncate">{product.product_name}</h4>
                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <span className="text-gray-900">₹{product.offer_price || product.price}</span>
                      {product.discount_percentage ? (
                        <span className="line-through text-gray-400 font-normal">₹{product.price}</span>
                      ) : null}
                      {product.discount_percentage ? (
                        <span className="text-[#a97c50] font-normal">{product.discount_percentage}% OFF</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="group relative overflow-hidden bg-gray-100 flex flex-col justify-end min-h-[400px]">
              <div className="absolute inset-0 bg-black/20 z-10" />
              {featuredCategory?.banner_image ? (
                <img
                  src={resolveImageUrl(featuredCategory.banner_image)}
                  alt={featuredCategory.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex h-full w-full items-center justify-center text-gray-500">
                  No spotlight banner available
                </div>
              )}
              <div className="relative p-6 text-white text-center z-20 flex flex-col items-center justify-end w-full h-full bg-gradient-to-t from-black/60 via-black/10 to-transparent pt-40">
                <h3 className="text-3xl font-serif tracking-wide sm:text-4xl text-white">
                  Crafted For Celebration
                </h3>
                <button
                  onClick={() => navigate(`/bridal-lehenga?category_id=${featuredCategory?.id || ''}&product_id=${featuredProducts[0]?.id || ''}`)}
                  className="mt-5 rounded-none bg-white px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#181818] transition hover:bg-[#a97c50] hover:text-white"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Single full-width category banner */}
          <div className="relative overflow-hidden bg-gray-100 flex flex-col justify-end min-h-[450px] group">
            <div className="absolute inset-0 bg-black/20 z-10" />
            {bannerCategory?.banner_image ? (
              <img
                src={resolveImageUrl(bannerCategory.banner_image)}
                alt={bannerCategory.name}
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="absolute inset-0 flex h-full w-full items-center justify-center text-gray-500">
                No category banner available
              </div>
            )}
            <div className="relative p-6 text-white text-center z-20 flex flex-col items-center justify-end w-full h-full bg-gradient-to-t from-black/60 via-black/10 to-transparent pt-36">
              <p className="text-xs uppercase tracking-[6px] text-white/80">Category</p>
              <h4 className="mt-3 text-3xl font-semibold tracking-wide text-white">{bannerCategory?.name || "Gowns"}</h4>
              <button
                onClick={() => navigate(`/bridal-lehenga?category_id=${bannerCategory?.id || ''}`)}
                className="mt-5 rounded-none bg-white px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#181818] transition hover:bg-[#a97c50] hover:text-white"
              >
                View Collection
              </button>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};

export default Spotlight;