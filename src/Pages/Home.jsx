import React from "react";
import Header from "../components/Header/Header";
import CabFleet from "../components/Fleet/Fleet";
import Process from "../components/Process/Process"
import AboutUs from "../components/AboutUsHomePage/AboutUsHomePage";
import Testimonials from "../components/Testimonial/Testimonial";

function Home() {
  return (
    <div>
    <Header/>
    <Process/>
    <AboutUs/>
    <CabFleet/>
    <Testimonials/>
    </div>
  );
};

export default Home;
