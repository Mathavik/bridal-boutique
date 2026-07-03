import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE =
  "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

function Celebration() {
  const navigate = useNavigate();

  const [banner, setBanner] = useState(null);

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/banner/get_banner.php?banner_title=${encodeURIComponent(
          "Crafted For Celebration"
        )}`
      );

      if (res.data.success) {
        setBanner(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!banner) return null;

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">

        <div
          className="relative h-[380px] bg-cover bg-center overflow-hidden rounded-lg"
          style={{
            backgroundImage: `url(${banner.image})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full">

            <h2 className="text-white text-5xl font-serif text-center mb-8">
              {banner.banner_title}
            </h2>

            {/* <button
              onClick={() => navigate("/bridal-lehenga")}
              className="bg-white text-black font-semibold px-10 py-3 hover:bg-black hover:text-white transition"
            >
              SHOP NOW
            </button> */}

          </div>
        </div>

      </div>
    </section>
  );
}

export default Celebration;