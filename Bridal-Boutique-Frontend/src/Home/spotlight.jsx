import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

const Spotlight = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const companyId = params.get("company_id");

      // allow overriding the banner by query param 'banner_title' or 'category'
      const bannerTitleParam = params.get("banner_title") || params.get("category") || "IN THE SPOTLIGHT";
      const bannerUrl = `${API_BASE}/banner/get_banner.php?banner_title=${encodeURIComponent(bannerTitleParam)}`;
      let productUrl = `${API_BASE}/product/get.php?limit=2`;
      if (companyId) {
        productUrl += `&company_id=${companyId}`;
      }

      const [productResponse, bannerResponse] = await Promise.all([
        axios.get(productUrl),
        axios.get(bannerUrl)
      ]);

      if (productResponse.data?.status) {
        setFeaturedProducts(productResponse.data.data || []);
      }

      if (bannerResponse.data?.success) {
        setBannerData(bannerResponse.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const featuredProduct = featuredProducts[0];

  const resolveImage = (path) => {
    if (!path) return "";

    if (path.startsWith("http")) {
      return path;
    }

    return `${API_BASE}/${path}`;
  };

  // Resolve assets that may be returned as full URLs or relative paths
  const resolveAsset = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // Use origin so relative paths like 'uploads/banners/..' resolve correctly
    return `${window.location.origin}/${path.replace(/^\/+/, "")}`;
  };

  // debug: inspect banner response when troubleshooting missing images
  // eslint-disable-next-line no-console
  console.log("spotlight bannerData:", bannerData);

  const bannerImage = resolveAsset(bannerData?.image) || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f";
  const bannerHeading = bannerData?.title || "Crafted For Celebration";
  const bannerSubtitle = bannerData?.banner_title || "Beautiful bridal style inspired by our latest banner collection.";
  const bannerLink = `/bridal-lehenga`;

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center text-4xl font-semibold uppercase tracking-[5px] mb-10">
          IN THE SPOTLIGHT
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="h-[500px] bg-gray-100 animate-pulse rounded-2xl"></div>
            <div className="h-[500px] bg-gray-100 animate-pulse rounded-2xl"></div>
          </div>

          <div className="h-[500px] bg-gray-100 animate-pulse rounded-2xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <h2 className="text-center text-4xl font-semibold uppercase tracking-[5px] mb-10">
        IN THE SPOTLIGHT
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT PRODUCTS */}

        <div className="grid sm:grid-cols-2 gap-6">

          {featuredProducts.map((product) => (

            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden"
            >

             {product.video_url ? (
  <video
    src={resolveImage(product.video_url)}
    className="w-full h-[360px] object-cover cursor-pointer"
    autoPlay
    muted
    loop
    playsInline
    controls
    onClick={() => navigate(`/bridal-lehenga?product_id=${product.id}`)}
  />
) : (
  <img
    src={resolveImage(product.image)}
    alt={product.product_name}
    className="w-full h-[360px] object-cover cursor-pointer"
    onClick={() => navigate(`/bridal-lehenga?product_id=${product.id}`)}
  />
)}

              <div className="mt-4">

                <h3 className="text-xl font-medium">
                  {product.product_name}
                </h3>

                <div className="flex items-center gap-3 mt-2">

                  <span className="text-2xl font-semibold">
                    ₹{product.offer_price || product.price}
                  </span>

                  {product.offer_price && (
                    <span className="line-through text-gray-400">
                      ₹{product.price}
                    </span>
                  )}

                  {product.discount_percentage && (
                    <span className="font-medium">
                      {product.discount_percentage}% OFF
                    </span>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* RIGHT BANNER */}

        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => navigate(bannerLink)}
        >

          <img
            src={bannerImage}
            alt={bannerHeading}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20"></div>

          <div className="absolute bottom-12 left-10">

            <h2 className="text-white text-5xl font-serif leading-tight">
              {bannerHeading}
            </h2>

            <p className="mt-4 text-white text-lg">
              {bannerSubtitle}
            </p>

            <button className="mt-6 bg-white px-8 py-3 font-semibold uppercase">
              SHOP NOW
            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Spotlight;