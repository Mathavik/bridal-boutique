import React from "react";
import bannerImage from "../assets/banner.png"; // Change the path if needed

const Banner: React.FC = () => {
  return (
    <section
      className="w-full h-[500px] bg-cover bg-center bg-no-repeat bg-fixed flex items-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      {/* Optional content */}
      <div className="container mx-auto px-6">
        {/* Add your text/buttons here if needed */}
      </div>
    </section>
  );
};

export default Banner;