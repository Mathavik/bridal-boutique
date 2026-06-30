import React from "react";
import Banner from "./banner";
import Celebration from "./celebration";
import NewArrivals from "./newarrivals";
import Spotlight from "./spotlight";
import Workflow from "./workflow";
import SpotlightSection from "./spotlight";

function Home() {
  return (
    <>
      <Banner />
      <Celebration />
      <NewArrivals />
      <SpotlightSection />
      <Workflow />
    </>
  );
}

export default Home;