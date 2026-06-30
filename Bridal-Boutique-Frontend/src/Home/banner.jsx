import React from "react";
import bannerImage from "../assets/banner.png";

function Banner() {
  return (
    <section
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Your banner content goes here */}
    </section>
  );
}

export default Banner;