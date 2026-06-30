import React from "react";

import arrivalOne from "../assets/arrivals/arrivals one.png";
import arrivalThree from "../assets/arrivals/arrivals three.png";
import arrivalFour from "../assets/arrivals/arrivals four.png";
import arrivalTwo from "../assets/arrivals/arrivals two.png";


function NewArrivals() {
  const arrivals = [
    {
      id: 1,
      image: arrivalOne,
      title: "Haldi & Mehendi",
      subtitle: "Outfits",
    },
    {
      id: 2,
      image: arrivalTwo,
      title: "Wedding WoW",
      subtitle: "Fits",
    },
    {
      id: 3,
      image: arrivalThree,
      title: "Bridemaid Top",
      subtitle: "Collections",
    },
    {
      id: 4,
      image: arrivalFour,
      title: "Special Sangeet",
      subtitle: "Looks",
    },
  ];

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center text-4xl font-semibold tracking-[6px] uppercase text-gray-900 mb-12">
          New Arrivals On Sale
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {arrivals.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden group cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[480px] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 flex flex-col justify-end items-center pb-12">
                <h3 className="text-white text-4xl font-serif text-center leading-tight">
                  {item.title}
                </h3>

                <h3 className="text-white text-4xl font-serif text-center mb-6">
                  {item.subtitle}
                </h3>

                <button className="bg-white text-black font-semibold px-10 py-3 hover:bg-black hover:text-white transition duration-300">
                  SHOP NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;