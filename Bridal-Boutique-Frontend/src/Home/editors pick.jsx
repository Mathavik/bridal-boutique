import React from "react";

import editorOne from "../assets/editors pick/editor one.png";
import editorTwo from "../assets/editors pick/editor two.png";

import editorBanner from "../assets/editors pick/editor banner.png";
import editBanOne from "../assets/editors pick/edit ban one.png";
import editBanTwo from "../assets/editors pick/edit ban two.png";

function EditorsPick() {
  const editorPicks = [
    {
      id: 1,
      image: editorOne,
      title: "Dress Materials",
    },
    {
      id: 2,
      image: editorTwo,
      title: "Readymade Suits",
    },
  ];

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        {/* ===================== TOP 2 IMAGES ===================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {editorPicks.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/10 flex flex-col justify-end items-start pb-10 pl-10">
                <h2 className="text-white text-5xl font-serif mb-6">
                  {item.title}
                </h2>

                <button className="bg-white text-black font-semibold px-8 py-3 hover:bg-black hover:text-white transition">
                  SHOP NOW
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ===================== BOTTOM BANNER ===================== */}

        <div
          className="relative mt-14 h-[500px] bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${editorBanner})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative z-10 h-full flex items-center justify-between px-12">
            {/* Left Content */}

            <div className="text-white max-w-lg">
              <h2 className="text-6xl font-serif leading-tight mb-8">
                Grown To Gowns
              </h2>

              <button className="bg-white text-black font-semibold px-8 py-3 hover:bg-black hover:text-white transition">
                SHOP NOW
              </button>
            </div>

            {/* Right Products */}

            <div className="flex gap-6">
              {/* Product 1 */}

              <div className="w-[210px]">
                <img
                  src={editBanOne}
                  alt="Agaphi Lehenga"
                  className="w-full h-[290px] object-cover"
                />

                <div className="text-white mt-3">
                  <h3 className="text-xl font-medium">
                    Agaphi Lehenga
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-xl">
                    <span>₹3499</span>

                    <span className="line-through text-gray-300">
                      ₹6999
                    </span>

                    <span>50% OFF</span>
                  </div>
                </div>
              </div>

              {/* Product 2 */}

              <div className="w-[210px]">
                <img
                  src={editBanTwo}
                  alt="Agaphi Lehenga"
                  className="w-full h-[290px] object-cover"
                />

                <div className="text-white mt-3">
                  <h3 className="text-xl font-medium">
                    Agaphi Lehenga
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-xl">
                    <span>₹3499</span>

                    <span className="line-through text-gray-300">
                      ₹6999
                    </span>

                    <span>50% OFF</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}

              <div className="flex items-center">
                <button className="w-12 h-12 rounded-full bg-white text-black text-2xl hover:bg-gray-200">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditorsPick;