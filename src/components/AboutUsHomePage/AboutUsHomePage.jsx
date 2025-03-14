import React from 'react';
import { Users, Star, Route, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const achievements = [
    {
      icon: <Users className="w-6 h-6 text-lime-400" />, 
      count: "10+", 
      label: "Years Experience"
    },
    {
      icon: <Star className="w-6 h-6 text-lime-400" />, 
      count: "4.9", 
      label: "Customer Rating"
    },
    {
      icon: <Route className="w-6 h-6 text-lime-400" />, 
      count: "100k+", 
      label: "Trips Completed"
    },
    {
      icon: <Award className="w-6 h-6 text-lime-400" />, 
      count: "50+", 
      label: "Professional Drivers"
    }
  ];

  return (
    <section className="relative py-20 bg-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-lime-400/10 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-lime-400/5 rounded-full filter blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="/src/assets/AboutUs/getting into a cab.jpg" 
                alt="Professional cab service" 
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60" />
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%]">
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">{item.icon}</div>
                      <div className="text-2xl font-bold text-white mb-1">{item.count}</div>
                      <div className="text-sm text-gray-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:pl-10">
            <div className="inline-flex items-center px-4 py-2 bg-lime-400/10 rounded-full text-lime-400 text-sm font-medium mb-6">
              About Mega City Cab
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Your Trusted Partner for 
              <span className="text-lime-400"> Premium Transportation</span>
            </h2>
            
            <p className="text-gray-300 mb-8">
              Since our establishment, Mega City Cab has been revolutionizing the transportation experience in Colombo. We combine modern technology with traditional Sri Lankan hospitality to deliver unparalleled service quality and customer satisfaction.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-lime-400" />
                <p className="text-gray-300">24/7 availability across Colombo</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-lime-400" />
                <p className="text-gray-300">Professional, licensed drivers</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-lime-400" />
                <p className="text-gray-300">Modern, well-maintained vehicle fleet</p>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/AboutUs')}
              className="group bg-lime-400 text-gray-900 px-6 py-3 rounded-xl font-semibold 
                             flex items-center gap-2 transition-all duration-300
                             hover:bg-lime-300 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.8)]">
              Learn More About Us
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
