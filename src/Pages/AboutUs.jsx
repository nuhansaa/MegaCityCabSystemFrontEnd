import React from 'react'
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar';
import AboutUsPage from '../components/AboutUs_Page/AboutUs_Page';
import Footer from '../components/Footer/Footer';


function AboutUs() {
  return (
    <div>
      <Navbar/>
      <AboutUsPage/>
      <Footer/>
    </div>
  )
}

export default AboutUs
