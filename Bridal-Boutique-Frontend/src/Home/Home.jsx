import React from "react";
import Banner from "./banner";
import Celebration from "./celebration";
import NewArrivals from "./newarrivals";
import Spotlight from "./spotlight";
import Workflow from "./workflow";
import EditorsPick from "./editors pick";

function Home() {
  return (
    <>
      <Banner />
      <Spotlight />
      <NewArrivals />
      <EditorsPick/>
      <Celebration />
      <Workflow />
    </>
  );
}

export default Home;