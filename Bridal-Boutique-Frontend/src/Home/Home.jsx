import React from "react";
import Banner from "./banner";
import Celebration from "./celebration";
import NewArrivals from "./newarrivals";
import Spotlight from "./spotlight";
import Workflow from "./workflow";

function Home() {
  return (
    <>
      <Banner />
      <Celebration />
      <NewArrivals />
      <Spotlight />
      <Workflow />
    </>
  );
}

export default Home;