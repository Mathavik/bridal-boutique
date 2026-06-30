import React from "react";

// import Header from "../components/Header";
import Banner from "./Banner";
import Celebration from "./celebration";
import NewArrivals from "./newarrivals";
import Spotlight from "./spotlight";
import Workflow from "./workflow";
// import Footer from "../components/Footer";

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