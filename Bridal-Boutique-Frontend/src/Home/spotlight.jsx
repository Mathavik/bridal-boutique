import React from "react";

import image1 from "../assets/spotlight/image1.png";
import image2 from "../assets/spotlight/image2.png";
import image3 from "../assets/spotlight/image3.png";
import image4 from "../assets/spotlight/image4.png";
import image5 from "../assets/spotlight/image5.png";
import image6 from "../assets/spotlight/image6.png";
// import banner from "../assets/spotlight/banner.png";
// import botik from "../assets/spotlight/Botik.png";

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

const products2 = [
  {
    id: 3,
    image: image5,
    title: "Agaphi Lehenga",
    price: "₹3499",
    oldPrice: "₹6999",
    offer: "50% OFF",
  },
  {
    id: 4,
    image: image4,
    title: "Agaphi Lehenga",
    price: "₹3499",
    oldPrice: "₹6999",
    offer: "50% OFF",
  },
];

const Spotlight = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h2 className="text-3xl font-semibold tracking-[5px] text-center uppercase mb-10">
        IN THE SPOTLIGHT
      </h2>

      {/* Top Section */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">

        {/* Left Products */}
        <div className="grid grid-cols-2 gap-4">
          {products1.map((item) => (
            <div key={item.id}>
              <img
                src={item.image}
                alt=""
                className="w-full h-[280px] object-cover"
              />

              <h3 className="mt-2 text-sm">{item.title}</h3>

              <div className="flex gap-2 text-sm">
                <span className="font-semibold">{item.price}</span>
                <span className="line-through text-gray-400">
                  {item.oldPrice}
                </span>
                <span>{item.offer}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className="lg:col-span-2 relative">

          <img
            src={image1}
            alt=""
            className="w-full h-[360px] object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
            <h1 className="text-5xl font-serif mb-5">
              Crafted For Celebration
            </h1>

            <button className="bg-white text-black px-6 py-2">
              SHOP NOW
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left Banner */}
        <div className="lg:col-span-2 relative">

          <img
            src={image6}
            alt=""
            className="w-full h-[360px] object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <h1 className="text-5xl font-serif mb-5">
              For Every Occasion
            </h1>

            <button className="bg-white text-black px-6 py-2 w-fit">
              SHOP NOW
            </button>
          </div>

        </div>

        {/* Right Products */}
        <div className="grid grid-cols-2 gap-4">

          {products2.map((item) => (
            <div key={item.id}>
              <img
                src={item.image}
                alt=""
                className="w-full h-[280px] object-cover"
              />

              <h3 className="mt-2 text-sm">{item.title}</h3>

              <div className="flex gap-2 text-sm">
                <span className="font-semibold">{item.price}</span>
                <span className="line-through text-gray-400">
                  {item.oldPrice}
                </span>
                <span>{item.offer}</span>
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Spotlight;