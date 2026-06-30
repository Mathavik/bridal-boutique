import React from "react";
import bannerImage from "../assets/banner.png";

function Banner() {
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        backgroundColor: "red",
      }}
    >
      <img
        src={bannerImage}
        alt="Banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export default Banner;