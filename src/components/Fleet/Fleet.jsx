import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';

const FleetSection = () => {
  const fleetData = [
    {
      name: "Nissan Sunny",
      image: "/src/assets/Cars/Nissan Sunny.jpg",
      price: "Starting from Rs. 60/km",
      features: [
        "4 Passengers",
        "3 Luggage Capacity",
        "Air Conditioned",
        "Ideal for City Rides"
      ],
      tags: ["Popular", "Economic"]
    },
    {
      name: "Mitsubishi Minicab",
      image: "/src/assets/Cars/Mitsubishi_MiniCab.jpg",
      price: "Starting from Rs. 80/km",
      features: [
        "6 Passengers",
        "4 Luggage Capacity",
        "Premium Interior",
        "Airport Transfers"
      ],
      tags: ["Luxury", "Family"]
    },
    {
      name: "Toyota Vitz",
      image: "/src/assets/Cars/Toyota-Vitz.jpg",
      price: "Starting from Rs. 100/km",
      features: [
        "3 Passengers",
        "2 Luggage Capacity",
        "Executive Service",
        "Corporate Events"
      ],
      tags: ["Business", "VIP"]
    }
  ];

  return (
    <section className="relative py-24 bg-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute left-0 top-1/4 w-1/3 h-1/3 bg-lime-400/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Our Premium <span className="text-lime-400">Fleet</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose from our selection of well-maintained vehicles, each designed to provide maximum comfort and safety for your journey.
          </p>
        </div>

        {/* Fleet Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {fleetData.map((vehicle, index) => (
            <motion.div
              key={vehicle.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 hover:border-lime-400/50 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {vehicle.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-lime-400/90 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{vehicle.name}</h3>
                <p className="text-lime-400 font-semibold mb-4">{vehicle.price}</p>
                
                {/* Features */}
                <ul className="space-y-3">
                  {vehicle.features.map(feature => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 text-lime-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated See More Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="group relative inline-flex items-center gap-2 bg-transparent border-2 border-lime-400 text-lime-400 px-8 py-4 rounded-xl font-semibold overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-lime-400"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
            
            {/* Button content */}
            <a href='/Cabs'>
            <motion.span className="relative z-10 group-hover:text-gray-900 transition-colors duration-200">
              See Full Fleet
            </motion.span></a>
            <motion.div
              className="relative z-10 group-hover:text-gray-900 transition-colors duration-200"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FleetSection;