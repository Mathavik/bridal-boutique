import React from "react";

import image1 from "../assets/spotlight/image1.png";
import image2 from "../assets/spotlight/image2.png";
import image3 from "../assets/spotlight/image3.png";
import image4 from "../assets/spotlight/image4.png";
import image5 from "../assets/spotlight/image5.png";
import image6 from "../assets/spotlight/image6.png";

const products1 = [
  {
    id: 1,
    image: image3,
    title: "Agaphi Lehenga",
    price: "₹3499",
    oldPrice: "₹6999",
    offer: "50% OFF",
  },
  {
    id: 2,
    image: image2,
    title: "Agaphi Lehenga",
    price: "₹3499",
    oldPrice: "₹6999",
    offer: "50% OFF",
  },
];

const Spotlight = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Heading */}
      <h2 className="text-3xl font-semibold tracking-[5px] text-center uppercase mb-10">
        IN THE SPOTLIGHT
      </h2>

      {/* ==================== TOP SECTION ==================== */}

      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {/* Left Products */}
        <div className="grid grid-cols-2 gap-4">
          {products1.map((item) => (
            <div key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[280px] object-cover"
              />

              <h3 className="mt-3 text-lg font-medium">{item.title}</h3>

              <div className="flex items-center gap-3 mt-1">
                <span className="font-semibold">{item.price}</span>

                <span className="line-through text-gray-400">
                  {item.oldPrice}
                </span>

                <span>{item.offer}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Banner */}
        <div className="lg:col-span-2 relative overflow-hidden">
          <img
            src={image1}
            alt="Crafted For Celebration"
className="w-full h-[360px] object-cover object-top"          />

          <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center pt-24">
  <h1 className="text-[56px] leading-none font-serif text-white mb-8">
    Crafted For Celebration
  </h1>

  <button className="bg-white text-black px-10 py-3 text-[15px] font-semibold hover:bg-black hover:text-white transition">
    SHOP NOW
  </button>
</div>
        </div>
      </div>

      {/* ==================== BOTTOM BANNER ==================== */}

      <div
        className="relative h-[420px] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${image6})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 h-full flex items-center justify-between px-12">
          {/* Left Content */}

          <div className="text-white">
            <h2 className="text-6xl font-serif mb-8">
              For Every Occasion
            </h2>

            <button className="bg-white text-black px-8 py-3 font-semibold hover:bg-black hover:text-white transition">
              SHOP NOW
            </button>
          </div>

          {/* Right Products */}

          <div className="flex items-center gap-6">
            {/* Product 1 */}

            <div className="w-[190px]">
              <img
                src={image4}
                alt="Agaphi Lehenga"
                className="w-full h-[265px] object-cover"
              />

              <div className="text-white mt-3">
                <h3 className="text-2xl font-medium">
                  Agaphi Lehenga
                </h3>

                <div className="flex items-center gap-3 mt-2 text-xl">
                  <span className="font-semibold">₹3499</span>

                  <span className="line-through text-gray-300">
                    ₹6999
                  </span>

                  <span>50% OFF</span>
                </div>
              </div>
            </div>

            {/* Product 2 */}

            <div className="w-[190px]">
              <img
                src={image5}
                alt="Agaphi Lehenga"
                className="w-full h-[265px] object-cover"
              />

              <div className="text-white mt-3">
                <h3 className="text-2xl font-medium">
                  Agaphi Lehenga
                </h3>

                <div className="flex items-center gap-3 mt-2 text-xl">
                  <span className="font-semibold">₹3499</span>

                  <span className="line-through text-gray-300">
                    ₹6999
                  </span>

                  <span>50% OFF</span>
                </div>
              </div>
            </div>

            {/* Arrow Button */}

            <button className="w-11 h-11 rounded-full bg-white text-black text-xl flex items-center justify-center hover:bg-gray-200 transition">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Spotlight;