import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "/src/assets/Testimonials/sarah.jpg",
      rating: 5,
      text: "The service is exceptional! Always on time and the drivers are very professional. I feel safe and comfortable every time I ride with Mega City Cab."
    },
    {
      id: 2,
      name: "David Chen",
      role: "Business Traveler",
      image: "/src/assets/Testimonials/David.jpg",
      rating: 5,
      text: "As a frequent business traveler, I appreciate their reliability and consistency. The booking process is smooth, and the cars are always clean and well-maintained."
    },
    {
      id: 3,
      name: "Amara Silva",
      role: "Local Resident",
      image: "/src/assets/Testimonials/Arman.jpg",
      rating: 5,
      text: "Best cab service in Colombo! The drivers are courteous and know the city well. I've never had a bad experience with Mega City Cab."
    }
  ];

  return (
    <div className="bg-gray-900 py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-lime-400/20 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-lime-400/10 rounded-full filter blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-lime-400/10 rounded-full text-lime-400 text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2" />
            Customer Reviews
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied customers about their experience with Mega City Cab.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 
                       transition-all duration-300 hover:border-lime-400/50"
            >
              <Quote className="w-10 h-10 text-lime-400 mb-4" />
              <p className="text-gray-300 mb-6">{testimonial.text}</p>
              
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-lime-400"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;