import React from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, Shield, MapPin, Phone, ChevronRight } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/src/assets/Background_Images/YellowCabs_WithCityLandscape.jpg" 
          alt="Taxi street scene" 
          className="absolute w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gray-900/30" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-lime-400/20 rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute top-[60%] right-[20%] w-96 h-96 bg-lime-400/10 rounded-full filter blur-[150px] animate-pulse delay-700" />
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Main Content - Takes 7 columns on large screens */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-lime-400/10 rounded-full text-lime-400 text-sm font-medium">
              <Clock className="w-4 h-4 mr-2" />
              Available 24/7 in Colombo
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold">
              <span className="text-white">Your Reliable</span>
              <br />
              <span className="text-lime-400">Cab Service</span>
            </h1>
            
            <p className="text-gray-300 text-lg max-w-2xl">
              Experience premium transportation with Mega City Cab. We're trusted by thousands of customers monthly for safe, comfortable, and punctual rides across Colombo.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6 py-8">
              <div className="border-l-2 border-lime-400 pl-4">
                <div className="text-3xl font-bold text-white">5000+</div>
                <div className="text-gray-400">Monthly Rides</div>
              </div>
              <div className="border-l-2 border-lime-400 pl-4">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-gray-400">Happy Clients</div>
              </div>
              <div className="border-l-2 border-lime-400 pl-4">
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-gray-400">Service Areas</div>
              </div>
            </div>

            {/* CTA Buttons with Animation */}
            <div className="flex flex-wrap gap-4 pt-4">
            <a href='/Cabs'>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                
                className="group bg-lime-400 text-gray-900 px-8 py-4 rounded-xl font-semibold 
                             flex items-center gap-2 transition-all duration-300
                             hover:bg-lime-300 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.8)]">
                Book Instant Ride
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              </a>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-transparent border-2 border-lime-400 text-lime-400 px-8 py-4 rounded-xl font-semibold
                             flex items-center gap-2 transition-all duration-300
                             hover:bg-lime-400 hover:text-gray-900">
                <Phone className="w-5 h-5" />
                Call Now
              </motion.button>
            </div>
          </div>

          {/* Feature Cards - Takes 5 columns on large screens */}
          <div className="lg:col-span-5 grid gap-4">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 
                        transition-all duration-300 hover:border-lime-400/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lime-400/10 rounded-lg">
                  <Shield className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Safe & Secure</h3>
                  <p className="text-gray-400">Professional drivers and GPS-tracked vehicles for your safety</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 
                        transition-all duration-300 hover:border-lime-400/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lime-400/10 rounded-lg">
                  <Car className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Premium Fleet</h3>
                  <p className="text-gray-400">Clean, comfortable, and well-maintained vehicles</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 
                        transition-all duration-300 hover:border-lime-400/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lime-400/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">City Coverage</h3>
                  <p className="text-gray-400">Available throughout Colombo and surrounding areas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;