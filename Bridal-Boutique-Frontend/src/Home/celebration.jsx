import React from "react";

import celebrationBg from "../assets/celebration/celebration.png";

function Celebration() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="relative h-[380px] bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${celebrationBg})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <h2 className="text-white text-6xl font-serif mb-8 text-center">
              Crafted For Celebration
            </h2>

            <button className="bg-white text-black font-semibold px-10 py-3 hover:bg-black hover:text-white transition duration-300">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Celebration;