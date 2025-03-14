import React from 'react';
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar';
import Cabs from '../components/Cabs/Cabs';
import Footer from '../components/Footer/Footer';

function FleetPage() {
  return (
    <div>
     <Navbar/>
     <Cabs/>
     <Footer/>
    </div>
  )
}

export default FleetPage