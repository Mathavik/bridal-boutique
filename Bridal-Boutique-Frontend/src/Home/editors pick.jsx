// EditorsPick.js
import React, { useEffect, useState } from "react";
// 👇 Import the shared API instance and media resolver
import api, { resolveMediaUrl } from "../services/api";   // adjust path if needed
import { useNavigate } from "react-router-dom";

function EditorsPick() {
  const navigate = useNavigate();

  const [dressBanner, setDressBanner] = useState(null);
  const [suitsBanner, setSuitsBanner] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      // ✅ Using api.get – base URL is automatically prepended
      const [dressRes, suitRes] = await Promise.all([
        api.get(
          `/banner/get_banner.php?banner_title=${encodeURIComponent(
            "Dress Materials"
          )}`
        ),
        api.get(
          `/banner/get_banner.php?banner_title=${encodeURIComponent(
            "Readymade Suits"
          )}`
        ),
      ]);

      if (dressRes.data.success) {
        setDressBanner(dressRes.data.data);
      }

      if (suitRes.data.success) {
        setSuitsBanner(suitRes.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const banners = [dressBanner, suitsBanner];

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {banners.map((item, index) =>
            item ? (
              <div key={index} className="relative overflow-hidden group">
                {/* ✅ Use resolveMediaUrl to handle absolute/relative paths */}
                <img
                  src={resolveMediaUrl(item.image)}
                  alt={item.title || item.banner_title}
                  className="w-full h-[420px] object-cover"
                />

                <div className="absolute bottom-10 left-8 flex flex-col items-start">
                  <h2 className="text-white text-[54px] font-serif leading-none drop-shadow-lg mb-6">
                    {item.banner_title}
                  </h2>
                  {/* Uncomment button when routes are ready */}
                  {/* <button
                    onClick={() =>
                      navigate(
                        item.banner_title === "Dress Materials"
                          ? "/dress-materials"
                          : "/readymade-suits"
                      )
                    }
                    className="bg-white text-black px-8 py-3 font-semibold hover:bg-black hover:text-white transition"
                  >
                    SHOP NOW
                  </button> */}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}

export default EditorsPick;